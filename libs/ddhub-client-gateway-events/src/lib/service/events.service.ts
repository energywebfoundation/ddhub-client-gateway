import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Events } from '../events.const';
import {
  EventsEntity,
  EventsWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { CommandBus } from '@nestjs/cqrs';
import { InitIamCommand } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { DidAuthCommand } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SecretChangeCommand } from '../../../../dsb-client-gateway-secrets-engine/src/lib/service/command/secret-change.command';
import { SecretType } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Injectable()
export class EventsService implements OnApplicationBootstrap {
  protected readonly acknowledgedEvents: Record<Events, number> = {
    [Events.PRIVATE_KEY_CHANGED]: undefined,
  };
  protected readonly logger = new Logger(EventsService.name);
  protected readonly workerId = uuidv4();

  constructor(
    protected readonly eventsWrapper: EventsWrapperRepository,
    protected readonly commandBus: CommandBus,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const loop = () => {
      setTimeout(() => {
        this.execute().then(loop).catch(loop);
      }, 5000);
    };

    loop();
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

          continue;
        }

        const isNew =
          this.acknowledgedEvents[event.eventType] <
          event.updatedDate.getTime();

        if (event.workerId === this.workerId && !isNew) {
          continue;
        }

        if (isNew) {
          this.logger.log(`new event ${event.eventType}`);

          await this.emitEvent(event.eventType as Events);

          this.acknowledgedEvents[event.eventType] =
            event.updatedDate.getTime();
        }
      } catch (e) {
        this.logger.error('events failed', e);
      }
    }
  }

  protected async emitEvent(eventType: Events): Promise<void> {
    switch (eventType) {
      case Events.PRIVATE_KEY_CHANGED:
        await this.commandBus.execute(
          new SecretChangeCommand(SecretType.PRIVATE_KEY)
        );
        await this.commandBus.execute(new InitIamCommand());
        await this.commandBus.execute(new DidAuthCommand());

        return;
    }
  }
}
