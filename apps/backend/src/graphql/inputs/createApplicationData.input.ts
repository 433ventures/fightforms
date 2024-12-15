import { InputType, Field } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CreateApplicationData } from '../../applications/types';

@InputType()
class CreateApplicationInput implements CreateApplicationData{
  @Length(1)
  @Field(() => String, { nullable: false })
  name!: string;

  @Length(1)
  @Field(() => String, { nullable: false })
  email!: string;

  @Length(1)
  @Field(() => String, { nullable: false })
  phone!: string;
}

export default CreateApplicationInput;
