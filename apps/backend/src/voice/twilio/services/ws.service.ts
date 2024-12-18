import { Injectable } from "@nestjs/common";
import { WebSocketServer } from "ws";
import { validate } from 'uuid';

import type { RealtimeClient } from '@openai/realtime-api-beta';
import OpenAIRealtimeService from '../../openai/realtime.service';

import { PromptsService } from '../../../prompts/prompts.service';
import { ApplicationsService } from '../../../applications/applications.service';
import Application from '../../../applications/entities/application.object';


@Injectable()
class AdminWSService {
  // wss://echo.websocket.org is a test websocket server
  private readonly wss: WebSocketServer;
  private streamSid: string;

  constructor(
    private readonly promptsService: PromptsService,
    private readonly applicationService: ApplicationsService,
    private readonly openAIRealtimeService: OpenAIRealtimeService,
  ) {
    const port = 3004
    this.wss =  new WebSocketServer({ port });
    this.wss.on('connection', this.connectionHandler.bind(this));
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
    const client = await this.openAIRealtimeService.getClient();

    client.realtime.on('server.*', (event) => {
      if (event.type === 'response.audio.delta' && event.delta) {
        const audioDelta = {
          event: 'media',
          streamSid: this.streamSid,
          media: { payload: Buffer.from(event.delta, 'base64').toString('base64') }
        };
        ws.send(JSON.stringify(audioDelta));
      }
    });

    // client.on('conversation.updated', async ({ item, delta }: any) => {
    //   const items = client.conversation.getItems();
    //   if (item.status === 'completed' && item.formatted.audio?.length) {
    //     console.log('Conversation item:', item);
    //   }
    // });

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
      this.applicationService.postprocessApplication(application);
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

    const linkedInInfo = application.linkedin;
    let user_profile_description = '';
    let user_company = '';

    try {
      const data = JSON.parse(String(linkedInInfo).replace('```json\n', '').replace('```', '').trim());

      user_profile_description =  data.user_profile_description;
      user_company = data.user_company;
    } catch (e) {
      console.error('Error parsing likendin data:', e);
    }

    const instructions = prompt
      .replace('{name}', application.name)
      .replace('{user_profile_description}', user_profile_description)
      .replace('{user_company}', user_company);

    const events = await this.openAIRealtimeService.connect(client, {
      instructions,
      input_audio_transcription: { model: 'whisper-1' },
      turn_detection: { type: 'server_vad' },
      input_audio_format: 'g711_ulaw',
      output_audio_format: 'g711_ulaw',
      modalities: ["text", "audio"],
      // temperature: 0.8,
    });

    events.on('next_question', async ({ question }) => {
      console.log('Next question:', question);
      await this.applicationService.nextQuestion(application.id, question);
    });

    events.on('save_answer', async ({ question, answer }) => {
      console.log('Save answer:', question, answer);
      await this.applicationService.saveAnswer(application.id, question, answer);
    });
  }
}

export default AdminWSService;
