import { Module } from '@nestjs/common';

import { ApplicationsModule } from '../applications/applications.module';
import { EventBusModule } from '../eventbus/enevtbus.module';
import { TwilioModule } from '../voice/twilio/twilio.module';

import ApplicationAnswerResolver from './resolvers/answer.resolver';

import ApplicationQueryResolver from './queries/application.query';
import QuestionQueryResolver from './queries/question.query';
import FieldSubscriptionsResolver from './queries/field.subscription';
import ApplicationsMutationsResolver from './mutations/application.mutation';
import ApplicationResolver from './resolvers/application.resolver';

@Module({
  imports: [
    EventBusModule,
    ApplicationsModule,
    TwilioModule,
  ],
  controllers: [],
  providers: [
    ApplicationAnswerResolver,
    ApplicationResolver,

    ApplicationQueryResolver,
    QuestionQueryResolver,
    FieldSubscriptionsResolver,
    ApplicationsMutationsResolver,
  ],
  exports: [],
})
export class GraphqlModule {}