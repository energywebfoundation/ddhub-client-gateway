import { Events } from '@dsb-client-gateway/ddhub-client-gateway-events';

export class TriggerEventCommand {
  constructor(public readonly event: Events) {}
}
