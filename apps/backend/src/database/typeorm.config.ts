import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

const dotenvPath = path.join(__dirname, '../../../../.env');

if (fs.existsSync(dotenvPath)) {
  config({
    path: dotenvPath,
  });
}

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [`${__dirname}/../**/*.entity.ts`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
});

export default dataSource;
