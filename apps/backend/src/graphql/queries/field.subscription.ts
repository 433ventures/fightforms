import { Args, ID, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import Application from '../../applications/entities/application.object';

@Resolver()
class FieldSubscriptionsResolver {
  constructor(
    private readonly pubSub: PubSub,
  ) {}

  @Subscription(() => Application)
  async fieldUpdated(
    @Args('applicationId', { type: () => ID }) applicationId: string,
  ) {
    return this.pubSub.asyncIterator(`field.${applicationId}`);
  }

  @Subscription(() => String)
  async questionChanged(
    @Args('applicationId', { type: () => ID }) applicationId: string,
  ) {
    return this.pubSub.asyncIterator(`question.${applicationId}`);
  }
}

export default FieldSubscriptionsResolver;
