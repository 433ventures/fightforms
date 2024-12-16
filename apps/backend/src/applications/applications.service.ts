import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { PubSub } from 'graphql-subscriptions';

import { ConfigType } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import config from '../config';
import { ApplicationAnswerData, CreateApplicationData } from './types';
import Application from './entities/application.object';
import ApplicationAnswer from './entities/answer.object';
import { ApplicationProcessingAgentService } from '../langchain/langchain.service';
import { QuestionsService } from './questions.service';

@Injectable()
export class ApplicationsService {
  private readonly googleSheets: sheets_v4.Sheets;
  private readonly dataSpreadsheetId: string;
  private readonly sheetName = 'Sheet1';

  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly pubSub: PubSub,
    private readonly applicationAgent: ApplicationProcessingAgentService,
    private readonly questionsService: QuestionsService,
    private readonly mailService: MailerService,
  ) {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(this.configService.google.credentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.googleSheets = google.sheets({ version: 'v4', auth });
    this.dataSpreadsheetId = this.configService.google.dataSpreadsheetId;
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    const application = new Application();
    application.id = uuidv4();
    application.name = data.name;
    application.email = data.email;
    application.phone = data.phone;

    try {
      const userInfo = await this.applicationAgent.exec(application.name, application.email);
      if (userInfo) {
        application.linkedin = userInfo.linkedin;
        application.summary = userInfo.summary;
      }
    } catch (error) {
      console.error('Error processing application:', error);
      throw new HttpException(
        'Error processing application',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await this.googleSheets.spreadsheets.values.append({
        spreadsheetId: this.dataSpreadsheetId,
        range: `${this.sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[application.id, application.name, application.phone, application.email, application.linkedin, application.summary]],
        },
      });

      if (response.status !== 200) {
        throw new Error('Error creating application');
      }

    } catch (error) {
      console.error('Error creating application:', error);
      throw new HttpException(
        'Error creating application',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return application;
  }

  async getApplicationRow(applicationId: string): Promise<{ rowNumber: number, data: string[] }> {
    const response = await this.googleSheets.spreadsheets.values.get({
      spreadsheetId: this.dataSpreadsheetId,
      range: this.sheetName,
    });

    const rows = response.data.values;

    if(!rows || rows.length === 0) {
      throw new Error('No data found.');
    }

    let applicationRow = null;
    for (const row of rows) {
      if (row[0] === applicationId) {
        applicationRow = row;
        break;
      }
    }

    if (!applicationRow) {
      return null;
    }

    const rowNumber = rows.indexOf(applicationRow) + 1

    return { data: applicationRow, rowNumber };
  }

  async getApplication(applicationId: string): Promise <Application | null > {
    try {
      const applicationRow = await this.getApplicationRow(applicationId);

      if (!applicationRow) {
        return null;
      }

      const application = new Application();
      application.id = applicationRow.data[0];
      application.rowNumber = applicationRow.rowNumber;
      application.name = applicationRow.data[1];
      application.phone = applicationRow.data[2];
      application.email = applicationRow.data[3];
      application.linkedin = applicationRow.data[4];
      application.summary = applicationRow.data[5];
      application.answers = await this.getApplicationAnswers(applicationId);

      return application;
    } catch (error){
      console.error('Error retrieving application:', error);
      throw new HttpException(
        'Error retrieving application',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getApplicationAnswers(applicationId: string): Promise <ApplicationAnswer[]> {
    const questions = await this.questionsService.getQuestions();
    const applicationRow = await this.getApplicationRow(applicationId);
    if (!applicationRow) {
      return [];
    }

    const answers: ApplicationAnswer[] = [];
    for (const question of questions) {
      const columnNumber = await this.findQuestionColumn(question.question);

      if (columnNumber === null) {
        continue;
      }

      const value = applicationRow.data[columnNumber - 1];
      if (!value) {
        continue;
      }

      const answer = new ApplicationAnswer();
      answer.id = `${applicationRow.data[0]}-${question.id}`;
      answer.label = question.id;
      answer.question = question.question;
      answer.answer = value;

      answers.push(answer);
    }

    return answers;
  }

  async findQuestionColumn(question: string): Promise<number | null> {
    try {
      const response = await this.googleSheets.spreadsheets.values.get({
        spreadsheetId: this.dataSpreadsheetId,
        range: `${this.sheetName}!1:1`,
      });

      const firstRow = response.data.values?.[0];

      if (!firstRow) {
        throw new Error('No data found in the first row.');
      }

      const columnIndex = firstRow.indexOf(question);

      if (columnIndex === -1) {
        return null;
      }

      return columnIndex + 1; // Google Sheets columns are 1-indexed
    } catch (error) {
      console.error('Error finding question column:', error);
      throw new HttpException(
        'Error finding question column',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private columnToLetter(column: number): string {
    let temp;
    let letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  }

  async saveAnswer(applicationId: string, question: string, answer: string): Promise <void> {
    const application = await this.getApplication(applicationId);

    if (!application) {
      throw new HttpException(
        'Application not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const prevAnswer = application.answers.find(answer => answer.question === question);
    const newAnswer = prevAnswer ? prevAnswer : new ApplicationAnswer();

    if (!prevAnswer) {
      const questions = await this.questionsService.getQuestions();
      const questionData = questions.find(q => q.question === question);
      newAnswer.id = `${applicationId}-${questionData.id}`;
      newAnswer.label = questionData.id;
      newAnswer.question = question;
      newAnswer.answer = answer;
      application.answers.push(newAnswer);
    } else {
      newAnswer.answer = answer;
    }

    await this.pubSub.publish(`field.${applicationId}`, { fieldUpdated: application });


    const rowNumber = application.rowNumber;
    const columnNumber = await this.findQuestionColumn(question);

    if (columnNumber === null) {
      throw new HttpException(
        'Question not found',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.googleSheets.spreadsheets.values.update({
        spreadsheetId: this.dataSpreadsheetId,
        range: `${this.sheetName}!${this.columnToLetter(columnNumber)}${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[answer]],
        },
      });
    } catch (error) {
      console.error('Error saving answer:', error);
      throw new HttpException(
        'Error saving answer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async nextQuestion(applicationId: string, question: string): Promise <void> {
    await this.pubSub.publish(`question.${applicationId}`, { questionChanged: question });
  }

  async postprocessApplication(application: Application): Promise <void> {
    console.log('Postprocessing application:', application);
    const questions = await this.questionsService.getQuestions();
    application.answers = await this.getApplicationAnswers(application.id);
    const agentResult = await this.applicationAgent.postprocessApplication({
      application,
      questions,
    });

    console.log(agentResult);
  }

  async submitAnswers(applicationId: string, answers: ApplicationAnswerData[]): Promise <Application> {
    const application = await this.getApplication(applicationId);
    const questions = await this.questionsService.getQuestions();

    if (!application) {
      throw new HttpException(
        'Application not found',
        HttpStatus.NOT_FOUND,
      );
    }

    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      const currentAnswer = application.answers.find(a => a.question === question.question);
      if (currentAnswer?.answer !== answer.answer && question) {
        await this.saveAnswer(applicationId, question.question, answer.answer);
      }
    }
    return application;
  }
}