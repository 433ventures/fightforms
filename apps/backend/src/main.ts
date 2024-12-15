import { NestFactory } from '@nestjs/core';
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';

const dotenvPath = path.join(__dirname, '../../../.env');
if (fs.existsSync(dotenvPath)) {
  config({
    path: dotenvPath,
  });
}
// eslint-disable-next-line
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
