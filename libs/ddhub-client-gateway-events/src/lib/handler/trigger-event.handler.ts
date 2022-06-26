import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TriggerEventCommand } from '../command/trigger-event.command';
import { EventsService } from '../service/events.service';

@CommandHandler(TriggerEventCommand)
export class TriggerEventHandler
  implements ICommandHandler<TriggerEventCommand>
{
  constructor(protected readonly eventsService: EventsService) {}

  public async execute({ event }: TriggerEventCommand): Promise<void> {
    await this.eventsService.triggerEvent(event);
  }
}
