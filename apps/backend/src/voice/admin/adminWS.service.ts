// socket-client.ts
import { Injectable } from "@nestjs/common";
import { WebSocketServer } from "ws";
import { validate } from 'uuid';

import type { RealtimeClient } from '@openai/realtime-api-beta';
import { PromptsService } from '../../prompts/prompts.service';
import { ApplicationsService } from '../../applications/applications.service';
import Application from '../../applications/entities/application.entity';
import OpenAIRealtimeService from '../openai/realtime.service';


@Injectable()
class AdminWSService {
  private readonly wss: WebSocketServer;

  constructor(
    private readonly promptsService: PromptsService,
    private readonly applicationService: ApplicationsService,
    private readonly openAIRealtimeService: OpenAIRealtimeService,
  ) {
    const port = 3003
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

    const prefix = '/admin/ws/';

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

    // Relay: OpenAI Realtime API Event -> Browser Event
    client.realtime.on('server.*', (event) => {
      this.log(`Relaying "${event.type}" to Client`);
      ws.send(JSON.stringify(event));
    });
    client.realtime.on('close', () => ws.close());

    // Relay: Browser Event -> OpenAI Realtime API Event
    // We need to queue data waiting for the OpenAI connection
    const messageQueue = [];
    const messageHandler = (data) => {
      try {
        const event = JSON.parse(data);
        if (event.type === 'session.update') {
          return;
        }
        this.log(`Relaying "${event.type}" to OpenAI`);
        client.realtime.send(event.type, event);
      } catch (e) {
        console.error(e.message);
        this.log(`Error parsing event from client: ${data}`);
      }
    };
    ws.on('message', (data) => {
      if (!client.isConnected()) {
        messageQueue.push(data);
      } else {
        messageHandler(data);
      }
    });
    ws.on('close', () => {
      this.applicationService.postprocessApplication(application);
      client.disconnect()
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
    while (messageQueue.length) {
      messageHandler(messageQueue.shift());
    }
  }

  log(...args) {
    console.log(`[RealtimeRelay]`, ...args);
  }

  async connect(client: RealtimeClient, application: Application) {
    this.log(`Getting Prompt...`);
    const prompt = await this.promptsService.getPrompt('chat');
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

    console.log('Instructions:', instructions);

    this.log(`Connecting to OpenAI...`);
    const events = await this.openAIRealtimeService.connect(client, {
      instructions,
      input_audio_transcription: { model: 'whisper-1' }
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
