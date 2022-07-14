import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Events } from '../events.const';
import {
  CronJobType,
  EventsEntity,
  EventsWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CommandBus } from '@nestjs/cqrs';
import { InitIamCommand } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SecretChangeCommand } from '../../../../dsb-client-gateway-secrets-engine/src/lib/service/command/secret-change.command';
import { SecretType } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ReloginCommand } from '../../../../ddhub-client-gateway-message-broker/src/lib/command/relogin.command';
import { EnrolmentIdentityChangedCommand } from '../command/enrolment-identity-changed.command';
import { CertificateChangedCommand } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';

@Injectable()
export class EventsService implements OnApplicationBootstrap {
  protected readonly acknowledgedEvents: Record<Events, number> = {
    [Events.PRIVATE_KEY_CHANGED]: undefined,
    [Events.ROLES_CHANGE]: undefined,
    [Events.CERTIFICATE_CHANGED]: undefined,
  };
  protected readonly logger = new Logger(EventsService.name);
  protected readonly workerId = uuidv4();

  constructor(
    protected readonly eventsWrapper: EventsWrapperRepository,
    protected readonly commandBus: CommandBus,
    protected readonly configService: ConfigService,
    protected readonly schedulerRegistry: SchedulerRegistry
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const cronJob = new CronJob('* * * * *', async () => {
      this.logger.log(`Executing refresh events`);

      await this.execute();
    });

    this.schedulerRegistry.addCronJob(CronJobType.EVENTS, cronJob);

    cronJob.start();
  }

  public async triggerEvent(event: Events): Promise<void> {
    await this.eventsWrapper.repository.save({
      eventType: event,
      workerId: this.workerId,
    });
  }

  public async execute(): Promise<void> {
    const events: EventsEntity[] = await this.eventsWrapper.repository.find();

    if (!events.length) {
      return;
    }

    for (const event of events) {
      try {
        if (!this.acknowledgedEvents[event.eventType]) {
          this.acknowledgedEvents[event.eventType] =
            event.updatedDate.getTime();

          this.logger.log(`initialized ${event.eventType} event`);

          if (
            this.workerId === event.workerId &&
            event.updatedDate.getTime() < new Date().getTime()
          ) {
            return;
          }

          await this.emitEvent(event.eventType as Events);
          continue;
        }

        const isNew =
          this.acknowledgedEvents[event.eventType] <
          event.updatedDate.getTime();

        if (event.workerId === this.workerId) {
          this.logger.debug(`same worker id`);
          continue;
        }

        if (isNew) {
          this.logger.log(`new event ${event.eventType}`);

          await this.emitEvent(event.eventType as Events);

          this.acknowledgedEvents[event.eventType] =
            event.updatedDate.getTime();
        }
      } catch (e) {
        this.logger.error('Event failed to execute', e);
      }
    }
  }

  public async emitEvent(eventType: Events): Promise<void> {
    switch (eventType) {
      case Events.PRIVATE_KEY_CHANGED:
        await this.commandBus.execute(
          new SecretChangeCommand(SecretType.PRIVATE_KEY)
        );
        await this.commandBus.execute(new InitIamCommand());
        await this.commandBus.execute(new ReloginCommand());
        await this.commandBus.execute(new EnrolmentIdentityChangedCommand());

        return;
      case Events.ROLES_CHANGE:
        await this.commandBus.execute(new ReloginCommand());
        return;
      case Events.CERTIFICATE_CHANGED:
        await this.commandBus.execute(new CertificateChangedCommand());
        await this.commandBus.execute(
          new SecretChangeCommand(SecretType.CERTIFICATE)
        );
        return;
      default:
        this.logger.error(`unknown event ${eventType}`);
        return;
    }
  }
}
