import { Inject, Injectable } from '@nestjs/common';
import type { RealtimeClient } from '@openai/realtime-api-beta';
import config from '../../config';
import { ConfigType } from '@nestjs/config';
import type { SessionResourceType } from '@openai/realtime-api-beta/dist/lib/client';
import { EventEmitter } from 'events';


@Injectable()
class OpenAIRealtimeService {
  private readonly apiKey: string;

  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {
    this.apiKey = this.configService.openAi.apiKey;
  }

  private log(message: string) {
    console.log(`[OpenAIRealtimeService] ${message}`);
  }

  async getClient(): Promise<RealtimeClient> {
    const { RealtimeClient } = await (eval(`import('@openai/realtime-api-beta')`) as Promise<typeof import('@openai/realtime-api-beta')>);
    const client = new RealtimeClient({
      apiKey: this.apiKey,
      // debug: true,
    });
    client.reset();

    return client;
  }

  async connect(client: RealtimeClient, sessionParams: SessionResourceType): Promise<EventEmitter> {
    this.log(`Connecting to OpenAI...`);
    client.updateSession(sessionParams);

    await client.connect();
    await client.waitForSessionCreated();

    const eventEmitter = new EventEmitter();

    client.addTool(
      {
        name: 'save_answer',
        description: 'Saves User answer to database',
        parameters: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description:
                'The question that was asked to the user',
            },
            answer: {
              type: 'string',
              description: 'The answer given by the user',
            },
          },
          required: ['question', 'answer'],
        },
      },
      async ({ question, answer }: { [key: string]: any }) => {
        console.log('save_answer', question, answer);
        eventEmitter.emit('save_answer', { question, answer });
        return { ok: true };
      }
    );

    client.addTool(
      {
        name: 'next_question',
        description: 'Save the next question to the memory',
        parameters: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description:
                'The question that will be asked to the user',
            },
          },
          required: ['question'],
        },
      },
      async ({ question }: { [key: string]: any }) => {
        console.log('next_question', question);
        eventEmitter.emit('next_question', { question });
        return { ok: true };
      }
    );

    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `Hello!`,
      },
    ]);

    return eventEmitter;
  }
}

export default OpenAIRealtimeService;
