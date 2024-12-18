
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';

import CreateApplicationInput from '../inputs/createApplicationData.input';
import Application from '../../applications/entities/application.entity';
import { ApplicationsService } from '../../applications/applications.service';
import { TwilioCallsService } from '../../voice/twilio/services/calls.service';
import ApplicationAnswerInput from '../inputs/applicationAnswerData.input';

@Resolver()
class ApplicationsMutationsResolver {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly twilioService: TwilioCallsService,
  ) {}

  @Mutation(() => Application)
  async createApplication(
    @Args(
      'data',
      { type: () => CreateApplicationInput, nullable: false },
      new ValidationPipe({ skipMissingProperties: true }),
    )
    data: CreateApplicationInput,
    @Args('useAI', { type: () => Boolean, nullable: true }) useAI: boolean | null,
  ): Promise<Application> {
    const application = await this.applicationsService.createApplication({
      ...data,
    });

    if (useAI) {
      await this.twilioService.call(application);
    }
    return application;
  }

  @Mutation(() => Application)
  async submitAnswers(
    @Args('id', { type: () => String, nullable: false }) id: string,
    @Args(
      'answers',
      { type: () => [ApplicationAnswerInput], nullable: false },
      new ValidationPipe({ skipMissingProperties: true }),
    ) answers: ApplicationAnswerInput[],
  ) {
    const application =await this.applicationsService.submitAnswers(id, answers);
    // await this.applicationsService.postprocessApplication(application);
    return application;
  }
}

export default ApplicationsMutationsResolver;
