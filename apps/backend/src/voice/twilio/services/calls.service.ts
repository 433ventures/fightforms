import { Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigType } from '@nestjs/config';

import config from '../../../config';

import Application from '../../../applications/entities/application.entity';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromPhone: string;
  toPhone: string;
}

@Injectable()
export class TwilioCallsService {
  private twilioConfig: TwilioConfig;
  private twilioClient: Twilio;

  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {
    this.twilioConfig = {
      accountSid: configService.twilio.accountSid,
      authToken: configService.twilio.authToken,
      fromPhone: configService.twilio.phoneNumber,
      toPhone: process.env.TWILIO_TO_PHONE || '',
    };

    this.twilioClient = new Twilio(this.twilioConfig.accountSid, this.twilioConfig.authToken);
  }

  async call(application: Application): Promise<void> {
    const streamUrl = `${process.env.TWILIO_WS_ENTRYPOINT}/${application.id}`;
    console.log(`Stream URL: ${streamUrl}`);

    try {
      const call = await this.twilioClient.calls.create({
        twiml: `
          <Response>
            <Connect>
                <Stream name="Example Audio Stream" url="${streamUrl}" />
            </Connect>
          </Response>
        `,
        to: `+${application.phone}`,
        from: this.twilioConfig.fromPhone,
      });

      console.log(`Call initiated with SID: ${call.sid}`);
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  }
}