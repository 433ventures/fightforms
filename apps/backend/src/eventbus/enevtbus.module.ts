import { Module } from '@nestjs/common';

import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PubSub,
  ],
  exports: [PubSub],
})
export class EventBusModule {}