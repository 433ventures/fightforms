import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Injectable } from "@nestjs/common";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { WebBrowser } from "langchain/tools/webbrowser";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage, ToolMessage } from '@langchain/core/messages';
import { v4 as uuidv4 } from 'uuid';
import { PromptsService } from '../prompts/prompts.service';
import Application from '../applications/entities/application.object';
import ApplicationQuestion from '../applications/entities/question.object';
import { DynamicTool } from '@langchain/core/tools';
import { MailerService } from '@nestjs-modules/mailer';
import buildEmail from './assets/email';

@Injectable()
export class ApplicationProcessingAgentService {
  private readonly llm: ChatOpenAI;
  private readonly webBrowserTool: WebBrowser;
  private readonly agentCheckpointer = new MemorySaver();


  constructor(
    private readonly promptsService: PromptsService,
    private readonly mailService: MailerService,
  ) {
    this.llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });
    const embeddings = new OpenAIEmbeddings();

    this.webBrowserTool = new WebBrowser({
      model: this.llm,
      embeddings,
    });

    this.llm.bindTools([this.webBrowserTool]);
  }

  async getLinkedInProfile(name: string, email: string): Promise<string> {
    const agent = createReactAgent({
      llm: this.llm,
      tools: [this.webBrowserTool],
      checkpointSaver: this.agentCheckpointer,
    })

    const prompt = await this.promptsService.getPrompt('linkedin');
    const promptWithData = prompt.replace('{name}', name).replace('{email}', email);

    const agentFinalState = await agent.invoke(
      { messages: [new HumanMessage(promptWithData)] },
      { configurable: { thread_id: uuidv4() } },
    );
    const result = agentFinalState.messages[agentFinalState.messages.length - 1].content;

    return String(result);
  }

  async summarize(url, name, email): Promise<string> {
    const agent = createReactAgent({
      llm: this.llm,
      tools: [this.webBrowserTool],
      checkpointSaver: this.agentCheckpointer,
    })

    const prompt = await this.promptsService.getPrompt('agent_user_context');
    const promptWithData = prompt.replace('{url}', url).replace('{name}', name).replace('{email}', email);

    const agentFinalState = await agent.invoke(
      { messages: [new HumanMessage(promptWithData)] },
      { configurable: { thread_id: uuidv4() } },
    );

    console.log(agentFinalState);
    const result = agentFinalState.messages[agentFinalState.messages.length - 1].content;

    return String(result);
  }

  async exec(name: string, email: string): Promise<{ linkedin: string, summary: string } | null> {
    const linkedInResult = await this.getLinkedInProfile(name, email);

    if (linkedInResult === 'Not found') {
      console.log('LinkedIn Profile not found');
      return null;
    }

    // const summary = await this.summarize(linkedInProfile, name, email);
    // console.log('Summary:', summary);

    return { linkedin: linkedInResult, summary: '' };
  }

  async postprocessApplication({
    application,
    questions,
  }: { application: Application, questions: ApplicationQuestion[] }): Promise<string> {

    const emailTool = new DynamicTool({
      name: "email",
      description: "Send an email with given text",
      func: async (text: string) => {
        const template = buildEmail({ application, text });
        await this.mailService.sendMail({
          from: 'FightForms AI Assistant <noreply@2nxp.io>',
          to: application.email,
          subject: `About your application to FightForms`,
          html: template,
        });

        console.log('email sent', text);
        return { status: 'ok' };
      },
    });

    this.llm.bindTools([emailTool]);

    const agent = createReactAgent({
      llm: this.llm,
      tools: [emailTool],
      checkpointSaver: this.agentCheckpointer,
    })

    const prompt = await this.promptsService.getPrompt('postprocess');
    const answersText = questions.map(question => {
      const answer = application.answers.find(a => a.question === question.question);
      return `<question>${question.question}</question><answer>${answer?.answer ? answer.answer : 'Not answered'}</answer>`;
    }).join('\n');

    const promptWithData = prompt.replace('{user_contact_info}', `
        Name: ${application.name}
        Email: ${application.email}
        Phone: ${application.phone}
        Summary: ${application.summary}
    `).replace('{application_questions_and_responses}', answersText);

    console.log(promptWithData);


    const agentFinalState = await agent.invoke(
      { messages: [new HumanMessage(promptWithData)] },
      { configurable: { thread_id: uuidv4() } },
    );
    const result = agentFinalState.messages[agentFinalState.messages.length - 1].content;

    console.log('Result:', result);

    try {
      const data = JSON.parse(String(result).replace('```json\n', '').replace('```', '').trim());
      return data.verification_result;
    } catch (e) {
      console.error('Error parsing result:', e);
      return null;
    }
  }
}