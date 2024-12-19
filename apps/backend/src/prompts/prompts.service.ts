import { Injectable } from '@nestjs/common';
import prompts from './assets';

@Injectable()
export class PromptsService {
  private readonly prompts: Record<string, string>

  constructor() {
    this.prompts = prompts;
  }


  async getPrompt(promptId: string): Promise <string | null > {
    if (this.prompts[promptId]) {
      return this.prompts[promptId];
    }

    return null;
  }
}