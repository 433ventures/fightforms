import path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsModule } from './applications/applications.module';
import { GraphqlModule as AppGraphqlModule } from './graphql/graphql.module';
import { VoiceModule } from './voice/voice.module';

import config from './config';
import typeOrmConfig from './database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig.options,
      autoLoadEntities: true,
    }),
    MailerModule.forRoot({
      transport: {
        url: process.env.SMTP_CONNECTION_URI,
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), '../../schema.gql'),
      playground: false,
      subscriptions: {
        'graphql-ws': true,
      },
      context: (context: any) => {
        const updatedContext = context;
        if (!context.req) {
          updatedContext.req = context.extra.request;
          const token = context.connectionParams?.authToken;
          if (token) {
            updatedContext.req.headers = {
              authorization: `Bearer ${token}`,
            };
          }
        }
        return updatedContext;
      },
    }),
    VoiceModule,
    ApplicationsModule,
    AppGraphqlModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
