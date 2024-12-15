import { Module } from '@nestjs/common';
import { TwilioModule } from './twilio/twilio.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TwilioModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class VoiceModule {}
