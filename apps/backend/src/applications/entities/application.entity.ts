import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import ApplicationAnswer from './answer.entity';

@Entity()
@ObjectType()
class Application {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'int', nullable: false })
  rowNumber: number;

  @Column({ nullable: false })
  @Field(() => String)
  name: string;

  @Column({ nullable: false })
  @Field(() => String)
  phone: string;

  @Column({ nullable: false })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  linkedin!: string | null;

  @Column({ nullable: true })
  summary!: string | null;

  @OneToMany(() => ApplicationAnswer, (item) => item.question, { cascade: true })
  @Field(() => [ApplicationAnswer], { nullable: false })
  answers!: ApplicationAnswer[];

  @CreateDateColumn({ type: 'timestamptz' })
  @Field(() => GraphQLISODateTime)
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field(() => GraphQLISODateTime)
  public updatedAt!: Date;
}

export default Application;
