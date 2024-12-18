import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import ApplicationQuestion from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(ApplicationQuestion)
    private questionsRepository: Repository<ApplicationQuestion>,
  ) {}

  async getItem(id: string): Promise<ApplicationQuestion> {
    const question = await this.questionsRepository.findOne({
      where: {
        id,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async getItemByQuestion(question: string): Promise<ApplicationQuestion> {
    const questionItem = await this.questionsRepository.findOne({
      where: {
        question,
      },
    });

    if (!questionItem) {
      throw new NotFoundException('Question not found');
    }

    return questionItem;
  }

  async getQuestions(): Promise<ApplicationQuestion[]> {
    return this.questionsRepository.find()
  }
}