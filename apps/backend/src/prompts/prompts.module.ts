import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
