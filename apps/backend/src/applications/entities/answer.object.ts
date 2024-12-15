
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
class ApplicationAnswer {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  label: string;

  @Field(() => String)
  question: string;

  @Field(() => String)
  answer: string;
}

export default ApplicationAnswer;
