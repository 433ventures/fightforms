import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import ApplicationQuestion from './question.entity';
import Application from './application.entity';

@Entity()
@ObjectType()
class ApplicationAnswer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  label: string;

  @ManyToOne(() => Application, (item) => item.answers, {
    nullable: false,
  })
  @JoinColumn({ name: 'applicationId' })
  @Field(() => Application, { nullable: false })
  application: Application;

  @Column({ type: 'uuid', nullable: false })
  @Field(() => ID, { nullable: false })
  applicationId: string;

  @ManyToOne(() => ApplicationQuestion, (item) => item.answers, {
    nullable: false,
  })
  @JoinColumn({ name: 'questionId' })
  @Field(() => ApplicationQuestion, { nullable: false })
  question: ApplicationQuestion;

  @Column({ type: 'uuid', nullable: false })
  @Field(() => ID, { nullable: false })
  questionId: string;

  @Column({ nullable: false })
  @Field(() => String)
  answer: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field(() => GraphQLISODateTime)
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field(() => GraphQLISODateTime)
  public updatedAt!: Date;
}

export default ApplicationAnswer;
