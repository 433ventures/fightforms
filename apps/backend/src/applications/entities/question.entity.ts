import {
  Entity,
  Column,
  PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import ApplicationAnswer from './answer.entity';

@Entity()
@ObjectType()
class ApplicationQuestion {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: false })
  @Field(() => String)
  inputName: string;

  @Column({ nullable: false })
  @Field(() => String)
  label: string;

  @Column({ nullable: false })
  @Field(() => String)
  question: string;

  @OneToMany(() => ApplicationAnswer, (item) => item.question, { cascade: true })
  answers!: ApplicationAnswer[];
}

export default ApplicationQuestion;
