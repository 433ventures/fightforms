import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  publicUrl: process.env.PUBLIC_URL,
  google: {
    credentials: process.env.GOOGLE_CREDENTIALS,
    promptsSpreadsheetId: process.env.PROMPTS_SPREADSHEET_ID,
    dataSpreadsheetId: process.env.DATA_SPREADSHEET_ID,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_FROM_PHONE,
  },
  openAi: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  smtp: {
    url: process.env.SMTP_CONNECTION_URI,
  }
}));