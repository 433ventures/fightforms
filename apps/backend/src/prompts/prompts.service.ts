import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';

import { ConfigType } from '@nestjs/config';

import config from '../config';

@Injectable()
export class PromptsService {
  private readonly googleSheets: sheets_v4.Sheets;
  private readonly promptsSpreadsheetId: string;
  private readonly sheetName = 'Sheet1';

  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(this.configService.google.credentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.googleSheets = google.sheets({ version: 'v4', auth });
    this.promptsSpreadsheetId = this.configService.google.promptsSpreadsheetId;
  }


  async getPrompt(promptId: string): Promise <string | null > {
    try {
      const response = await this.googleSheets.spreadsheets.values.get({
        spreadsheetId: this.promptsSpreadsheetId,
        range: this.sheetName,
      });

      const rows = response.data.values;

      if(!rows || rows.length === 0) {
        throw new Error('No data found.');
      }

      for (const row of rows) {
        if (row[0] === promptId) {
          return row[1] ?? null; // Return value from the second column
        }
      }

      return null;
    } catch (error){
      console.error('Error retrieving the prompt:', error);
      throw new HttpException(
        'Error retrieving the prompt',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}