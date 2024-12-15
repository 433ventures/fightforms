
import { ObjectType, Field, ID } from '@nestjs/graphql';
import ApplicationAnswer from './answer.object';

@ObjectType()
class Application {
  @Field(() => ID)
  id: string;

  rowNumber: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  linkedin!: string | null;

  summary!: string | null;

  @Field(() => [ApplicationAnswer], { nullable: false })
  answers!: ApplicationAnswer[];
}

export default Application;
