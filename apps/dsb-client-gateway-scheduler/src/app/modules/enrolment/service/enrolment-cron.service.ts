import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EnrolmentService } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { CronJob } from 'cron';
import {
  CronJobType,
  CronStatus,
  CronWrapperRepository,
  EnrolmentEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  Events,
  EventsService,
} from '@dsb-client-gateway/ddhub-client-gateway-events';
import { CommandBus } from '@nestjs/cqrs';
import { ReloginCommand } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Injectable()
export class EnrolmentCronService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(EnrolmentCronService.name);

  constructor(
    protected readonly enrolmentService: EnrolmentService,
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly cronWrapper: CronWrapperRepository,
    protected readonly iamService: IamService,
    protected readonly eventsService: EventsService,
    protected readonly commandBus: CommandBus
  ) { }

  public async onApplicationBootstrap(): Promise<void> {
    const isCronEnabled: boolean = this.configService.get<boolean>(
      'ROLES_REFRESH_CRON_ENABLED',
      true
    );

    if (!isCronEnabled) {
      this.logger.warn(`Refresh roles cron job is disabled`);

      return;
    }

    const cronJob = new CronJob(
      this.configService.get<string>('ROLES_REFRESH_CRON_SCHEDULE'),
      async () => {
        this.logger.log(`Executing roles refresh`);

        await this.execute();
      }
    );

    await this.schedulerRegistry.addCronJob(CronJobType.ROLES_REFRESH, cronJob);

    cronJob.start();
  }

  public async execute(): Promise<void> {
    try {
      const isInitialized: boolean = this.iamService.isInitialized();

      if (!isInitialized) {
        this.logger.error(`IAM is not initialized. Please setup private key`);

        return;
      }

      await this.iamService.unSyncPublicClaim();

      const cachedEnrolment: EnrolmentEntity | null =
        await this.enrolmentService.getFromCache();

      if (!cachedEnrolment) {
        this.logger.log('new enrolment');

        await this.enrolmentService.generateEnrolment();
        await this.triggerRoleChange();

        await this.cronWrapper.cronRepository.save({
          jobName: CronJobType.ROLES_REFRESH,
          latestStatus: CronStatus.SUCCESS,
          executedAt: new Date(),
        });

        return;
      }

      const newEnrolment: EnrolmentEntity =
        await this.enrolmentService.generateEnrolment();

      const hasEnrolmentChanged: boolean = this.hasEnrolmentChanged(
        cachedEnrolment,
        newEnrolment
      );

      if (!hasEnrolmentChanged) {
        this.logger.debug(
          `no enrolment change`,
          'cached enrolment',
          JSON.stringify(cachedEnrolment),
          'new enrolment',
          JSON.stringify(newEnrolment)
        );

        await this.cronWrapper.cronRepository.save({
          jobName: CronJobType.ROLES_REFRESH,
          latestStatus: CronStatus.SUCCESS,
          executedAt: new Date(),
        });

        return;
      }

      this.logger.log('enrolment changed');

      await this.triggerRoleChange();

      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.ROLES_REFRESH,
        latestStatus: CronStatus.SUCCESS,
        executedAt: new Date(),
      });
    } catch (e) {
      await this.cronWrapper.cronRepository.save({
        jobName: CronJobType.ROLES_REFRESH,
        latestStatus: CronStatus.FAILED,
        executedAt: new Date(),
      });

      this.logger.error('refresh roles failed', e);
      console.error(e);
    }
  }

  private async triggerRoleChange(): Promise<void> {
    await this.eventsService.triggerEvent(Events.ROLES_CHANGE);
    await this.commandBus.execute(new ReloginCommand('ROLES_CHANGE'));
  }

  private hasEnrolmentChanged(
    cachedEnrolment: EnrolmentEntity,
    newEnrolment: EnrolmentEntity
  ): boolean {
    const cachedEnrolmentRoles: string[] = cachedEnrolment.roles.map(
      ({ namespace }) => namespace
    );
    const newEnrolmentRoles: string[] = newEnrolment.roles.map(
      ({ namespace }) => namespace
    );

    // If new role shows up or get removed we return true
    if (cachedEnrolmentRoles.length !== newEnrolmentRoles.length) {
      return true;
    }

    const rolesIntersection: string[] = cachedEnrolmentRoles.filter(
      (namespace) => newEnrolmentRoles.includes(namespace)
    );

    // If roles length is the same but one role was dropped and another one added return true
    if (rolesIntersection.length !== cachedEnrolmentRoles.length) {
      return true;
    }

    // check for role status changes
    for (const role of cachedEnrolment.roles) {
      const newRole = newEnrolment.roles.find(
        ({ namespace }) => namespace === role.namespace
      );

      if (!newRole) {
        return true;
      }

      if (role.status !== newRole.status) {
        return true;
      }
    }
  }
}
