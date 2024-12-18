import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { PubSub } from 'graphql-subscriptions';

import { ApplicationAnswerData, CreateApplicationData } from './types';
import Application from './entities/application.entity';
import ApplicationAnswer from './entities/answer.entity';
import { ApplicationProcessingAgentService } from '../langchain/langchain.service';
import { QuestionsService } from './questions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationsService {

  constructor(
    private readonly pubSub: PubSub,
    private readonly applicationAgent: ApplicationProcessingAgentService,
    private readonly questionsService: QuestionsService,

    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(ApplicationAnswer)
    private answersRepository: Repository<ApplicationAnswer>,
  ) {
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    const application = new Application();
    application.rowNumber = await this.applicationsRepository.count() + 1;
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


    await this.applicationsRepository.save(application);
    return application;
  }

  async getApplication(applicationId: string): Promise <Application | null > {
    const application = await this.applicationsRepository.findOne({
      where: {
        id: applicationId,
      },
    });
    if (!application) {
      return null;
    }
    application.answers = await this.getApplicationAnswers(applicationId);
    return application;
  }

  async getApplicationAnswers(applicationId: string): Promise <ApplicationAnswer[]> {
    return this.answersRepository.find({
      where: {
        applicationId,
      },
      order: {
        createdAt: 'ASC',
      }
    });
  }

  async saveAnswer(applicationId: string, question: string, answer: string): Promise <void> {
    const application = await this.getApplication(applicationId);

    if (!application) {
      throw new HttpException(
        'Application not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const questionItem = await this.questionsService.getItemByQuestion(question);

    const prevAnswer = application.answers.find(answer => answer.questionId === questionItem.id);
    const newAnswer = prevAnswer ? prevAnswer : new ApplicationAnswer();

    if (!prevAnswer) {
      newAnswer.applicationId = applicationId;
      newAnswer.label = questionItem.label;
      newAnswer.questionId = questionItem.id;
      newAnswer.answer = answer;
      application.answers.push(newAnswer);
    } else {
      newAnswer.answer = answer;
    }

    await this.answersRepository.save(newAnswer);
    await this.pubSub.publish(`field.${applicationId}`, { fieldUpdated: application });
  }

  async nextQuestion(applicationId: string, question: string): Promise <void> {
    await this.pubSub.publish(`question.${applicationId}`, { questionChanged: question });
  }

  async postprocessApplication(application: Application): Promise <void> {
    console.log('Postprocessing application:', application);
    const questions = await this.questionsService.getQuestions();
    application.answers = await this.getApplicationAnswers(application.id);

    await this.applicationAgent.postprocessApplication({
      application,
      questions,
    });
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
      const currentAnswer = application.answers.find(a => a.questionId === question.id);

      if (currentAnswer?.answer !== answer.answer && question) {
        await this.saveAnswer(applicationId, question.question, answer.answer);
      }
    }
    return application;
  }
}