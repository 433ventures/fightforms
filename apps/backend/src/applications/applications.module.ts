import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsService } from './applications.service';
import { EventBusModule } from '../eventbus/enevtbus.module';
import { ApplicationProcessingAgentService } from '../langchain/langchain.service';
import { QuestionsService } from './questions.service';
import { PromptsModule } from '../prompts/prompts.module';

import Application from './entities/application.entity';
import ApplicationAnswer from './entities/answer.entity';
import ApplicationQuestion from './entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      ApplicationAnswer,
      ApplicationQuestion,
    ]),
    EventBusModule,
    PromptsModule
  ],
  controllers: [],
  providers: [
    ApplicationsService,
    QuestionsService,
    ApplicationProcessingAgentService
  ],
  exports: [ApplicationsService, QuestionsService],
})
export class ApplicationsModule {}
