import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { QuestionsService } from '../../applications/questions.service';
import ApplicationQuestion from '../../applications/entities/question.entity';


@Resolver()
class QuestionQueryResolver {
  constructor(
    private readonly questionsService: QuestionsService,
  ) {}

  @Query(() => [ApplicationQuestion], { nullable: true})
  async questions(): Promise<ApplicationQuestion[] | null> {
    return this.questionsService.getQuestions();
  }

}

export default QuestionQueryResolver;
