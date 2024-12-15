import { Module } from '@nestjs/common';

import { ApplicationsModule } from '../applications/applications.module';
import { EventBusModule } from '../eventbus/enevtbus.module';
import { TwilioModule } from '../voice/twilio/twilio.module';

import ApplicationQueryResolver from './queries/application.query';
import QuestionQueryResolver from './queries/question.query';
import FieldSubscriptionsResolver from './queries/field.subscription';
import ApplicationsMutationsResolver from './mutations/application.mutation';

@Module({
  imports: [
    EventBusModule,
    ApplicationsModule,
    TwilioModule,
  ],
  controllers: [],
  providers: [
    ApplicationQueryResolver,
    QuestionQueryResolver,
    FieldSubscriptionsResolver,
    ApplicationsMutationsResolver,
  ],
  exports: [],
})
export class GraphqlModule {}