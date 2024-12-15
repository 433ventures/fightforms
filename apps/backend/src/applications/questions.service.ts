import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';

import { ConfigType } from '@nestjs/config';

import config from '../config';

import ApplicationQuestion from './entities/question.object';

@Injectable()
export class QuestionsService {
  private readonly googleSheets: sheets_v4.Sheets;
  private readonly dataSpreadsheetId: string;
  private readonly sheetName = 'questions';

  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(this.configService.google.credentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.googleSheets = google.sheets({ version: 'v4', auth });
    this.dataSpreadsheetId = this.configService.google.dataSpreadsheetId;
  }

  async getQuestions(): Promise<ApplicationQuestion[]> {
    try {
      const response = await this.googleSheets.spreadsheets.values.get({
        spreadsheetId: this.dataSpreadsheetId,
        range: `${this.sheetName}!A2:B`,
      });

      const rows = response.data.values;

      if (!rows || rows.length === 0) {
        throw new Error('No data found.');
      }

      return rows.map(row => {
        const question = new ApplicationQuestion();
        question.id = row[0];
        question.question = row[1];

        return question;
      });
    } catch (error) {
      console.error('Error retrieving questions:', error);
      throw new HttpException(
        'Error retrieving questions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}