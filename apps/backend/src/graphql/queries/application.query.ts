import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import Application from '../../applications/entities/application.entity';
import { ApplicationsService } from '../../applications/applications.service';
import { TwilioCallsService } from '../../voice/twilio/services/calls.service';


@Resolver()
class ApplicationQueryResolver {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly twilioService: TwilioCallsService,
  ) {}

  @Query(() => Application, { nullable: true})
  async application(
    @Args('id', { type: () => ID, nullable: false }) id: string,
  ): Promise<Application | null> {
    const application = await this.applicationsService.getApplication(id);

    if (!application) {
      return null;
    }
    // await this.twilioService.call(application);
    // await this.applicationsService.postprocessApplication(application);
    return application;
  }

}

export default ApplicationQueryResolver;
