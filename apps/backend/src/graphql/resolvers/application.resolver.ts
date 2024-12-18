import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import ApplicationAnswer from '../../applications/entities/answer.entity';

import Application from '../../applications/entities/application.entity';
import { ApplicationsService } from '../../applications/applications.service';

@Resolver(() => Application)
class ApplicationResolver {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @ResolveField(() => [ApplicationAnswer], { nullable: false })
  async answers(
    @Parent() item: Application,
  ): Promise<ApplicationAnswer[]> {
    return item.answers || await this.applicationsService.getApplicationAnswers(item.id);
  }
}

export default ApplicationResolver;
