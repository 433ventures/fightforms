import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import ApplicationAnswer from '../../applications/entities/answer.entity';
import ApplicationQuestion from '../../applications/entities/question.entity';

import { QuestionsService } from '../../applications/questions.service';

@Resolver(() => ApplicationAnswer)
class ApplicationAnswerResolver {
  constructor(
    private readonly questionsService: QuestionsService,
  ) {}

  @ResolveField(() => ApplicationQuestion, { nullable: false })
  async question(
    @Parent() item: ApplicationAnswer,
  ): Promise<ApplicationQuestion> {
    return this.questionsService.getItem(item.questionId);
  }
}

export default ApplicationAnswerResolver;
