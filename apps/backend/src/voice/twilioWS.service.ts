// socket-client.ts
import { Injectable } from "@nestjs/common";
import { WebSocketServer, W } from "ws";
import { validate } from 'uuid';

import type { RealtimeClient } from '@openai/realtime-api-beta';
import { PromptsService } from '../prompts/prompts.service';
import { ApplicationsService } from '../applications/applications.service';
import Application from '../applications/entities/application.object';


@Injectable()
class AdminWSService {
  // wss://echo.websocket.org is a test websocket server
  private readonly wss: WebSocketServer;
  private readonly apiKey: string;
  private streamSid: string;
  private readonly sockets = new WeakMap();

  constructor(
    private readonly promptsService: PromptsService,
    private readonly applicationService: ApplicationsService,
  ) {
    const port = 3004
    this.wss =  new WebSocketServer({ port });
    this.wss.on('connection', this.connectionHandler.bind(this));
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async connectionHandler(ws, req) {
    if (!req.url) {
      this.log('No URL provided, closing connection.');
      ws.close();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    const prefix = '/twilio/ws/';

    if (!pathname.startsWith(prefix)) {
      this.log(`Invalid pathname: "${pathname}"`);
      ws.close();
      return;
    }

    const sessionId = pathname.slice(prefix.length);
    if (!validate(sessionId)) {
      this.log(`Invalid sessionId: "${sessionId}"`);
      ws.close();
      return;
    }

    const application = await this.applicationService.getApplication(sessionId);
    if (!application) {
      this.log(`Application not found: "${sessionId}"`);
      ws.close();
      return;
    }


    // Instantiate new client
    this.log(`Connecting with key "${this.apiKey.slice(0, 3)}..."`);
    const { RealtimeClient } = await (eval(`import('@openai/realtime-api-beta')`) as Promise<typeof import('@openai/realtime-api-beta')>);
    const client = new RealtimeClient({
      apiKey: this.apiKey,
      // debug: true,
    });
    client.reset();
    // client.disconnect();

    client.realtime.on('server.*', (event) => {
      // this.log(`Relaying "${event.type}" to Client`);
      // ws.send(JSON.stringify(event));

      // console.log(`Received event: ${event.type}`, event);

      if (event.type === 'response.audio.delta' && event.delta) {
        console.log('audio');
        console.log(event);

        const audioDelta = {
          event: 'media',
          streamSid: this.streamSid,
          media: { payload: Buffer.from(event.delta, 'base64').toString('base64') }
        };
        // console.log(audioDelta);
        ws.send(JSON.stringify(audioDelta));
      }
    });

    client.on('conversation.updated', async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (item.status === 'completed' && item.formatted.audio?.length) {
        console.log('Conversation item:', item);
      }
    });

    // Handle incoming messages from Twilio
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);

        // console.log('Received message:', data);

        switch (data.event) {
          case 'media':
            if (this.streamSid !== data.streamSid) {
              this.streamSid = data.streamSid;
            }
            if (client.isConnected()) {
              // const audioAppend = {
              //   audio: data.media.payload
              // };

              // console.log('Appending audio:', data.media.payload);
              // client.appendInputAudio(data.media.payload);
              client.realtime.send('input_audio_buffer.append', {
                audio: data.media.payload,
              });
            }
            break;
          case 'start':
            console.log('Incoming stream has started', this.streamSid);


            break;
          default:
            console.log('Received non-media event:', data.event);
            break;
        }
      } catch (error) {
        console.error('Error parsing message:', error, 'Message:', message);
      }
    });

    // Handle connection close
    ws.on('close', () => {
      if (client.realtime.isConnected()) client.realtime.disconnect();
      console.log('Client disconnected.');
    });

    // Handle WebSocket close and errors
    client.realtime.on('close', () => {
      console.log('Disconnected from the OpenAI Realtime API');
    });

    client.realtime.on('error', (error) => {
      console.error('Error in the OpenAI WebSocket:', error);
    });


    // Connect to OpenAI Realtime API
    try {
      await this.connect(client, application);
    } catch (e) {
      this.log(`Error connecting to OpenAI: ${e.message}`);
      ws.close();
      return;
    }

    this.log(`Connected to OpenAI successfully!`);
    this.log(`Client connected`);
  }

  log(...args) {
    console.log(`[TwilioRelay]`, ...args);
  }

  async connect(client: RealtimeClient, application: Application) {
    this.log(`Getting Prompt...`);
    const prompt = await this.promptsService.getPrompt('chat');
    console.log('Prompt:', prompt);
    if (!prompt) {
      throw new Error('Prompt not found');
    }

    this.log(`Connecting to OpenAI...`);
    client.updateSession({
      instructions: prompt.replace('{name}', application.name),
      input_audio_transcription: { model: 'whisper-1' },
      turn_detection: { type: 'server_vad' },
      input_audio_format: 'g711_ulaw',
      output_audio_format: 'g711_ulaw',
      modalities: ["text", "audio"],
      temperature: 0.8,
    });
    await client.connect();
    await client.waitForSessionCreated();

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
        this.applicationService.saveAnswer(application.id, question, answer);
        return { ok: true };
      }
    );

    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `Hello!`,
      },
    ]);
  }
}

export default AdminWSService;
