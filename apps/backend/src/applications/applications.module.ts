import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { EventBusModule } from '../eventbus/enevtbus.module';
import { ApplicationProcessingAgentService } from '../langchain/langchain.service';
import { QuestionsService } from './questions.service';
import { PromptsModule } from '../prompts/prompts.module';

@Module({
  imports: [EventBusModule, PromptsModule],
  controllers: [],
  providers: [
    ApplicationsService,
    QuestionsService,
    ApplicationProcessingAgentService
  ],
  exports: [ApplicationsService, QuestionsService],
})
export class ApplicationsModule {}
