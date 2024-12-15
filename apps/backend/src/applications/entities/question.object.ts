
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
class ApplicationQuestion {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  question: string;
}

export default ApplicationQuestion;
