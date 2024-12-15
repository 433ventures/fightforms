import { Module } from '@nestjs/common';
import OpenAIRealtimeService from './realtime.service';

@Module({
  imports: [
  ],
  controllers: [],
  providers: [
    OpenAIRealtimeService
  ],
  exports: [
    OpenAIRealtimeService,
  ]
})
export class OpenaiModule {}
