import { Module } from '@nestjs/common';
import { PromptsModule } from '../../prompts/prompts.module';
import { ApplicationsModule } from '../../applications/applications.module';
import { OpenaiModule } from '../openai/openai.module';

import TwilioWSService from './services/ws.service';
import { TwilioCallsService } from './services/calls.service';

@Module({
  imports: [
    PromptsModule,
    ApplicationsModule,
    OpenaiModule,
  ],
  controllers: [],
  providers: [
    TwilioCallsService,
    TwilioWSService,
  ],
  exports: [
    TwilioCallsService,
  ]
})
export class TwilioModule {}
