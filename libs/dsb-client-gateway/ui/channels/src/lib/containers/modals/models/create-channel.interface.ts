import { CreateChannelDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ChannelType } from '../../../models/channel-type.enum';

export interface ICreateChannel extends CreateChannelDto {
  connectionType: ConnectionType | string;
  channelType: ChannelType | string;
}
