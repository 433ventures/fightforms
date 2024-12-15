
import { Module } from '@nestjs/common';
import { PromptsModule } from '../../prompts/prompts.module';
import { ApplicationsModule } from '../../applications/applications.module';
import { OpenaiModule } from '../openai/openai.module';
import AdminWSService from './adminWS.service';


@Module({
  imports: [
    PromptsModule,
    ApplicationsModule,
    OpenaiModule,
  ],
  controllers: [],
  providers: [
    AdminWSService,
  ],
  exports: [
  ]
})
export class AdminModule {}
