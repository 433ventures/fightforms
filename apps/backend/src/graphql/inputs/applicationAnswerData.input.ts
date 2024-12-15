import { InputType, Field } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { ApplicationAnswerData } from '../../applications/types';

@InputType()
class ApplicationAnswerInput implements ApplicationAnswerData{
  @Length(1)
  @Field(() => String, { nullable: false })
  questionId!: string;

  @Length(1)
  @Field(() => String, { nullable: false })
  answer!: string;
}

export default ApplicationAnswerInput;
