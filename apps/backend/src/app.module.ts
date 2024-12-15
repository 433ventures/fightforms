import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqlModule as AppGraphqlModule } from './graphql/graphql.module';
import { MailerModule } from '@nestjs-modules/mailer';

import { VoiceModule } from './voice/voice.module';
import config from './config';
import path from 'path';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
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
