import {
  ApplicationDTO,
  GetChannelResponseDto,
  ChannelTopic,
  GetTopicSearchDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum } from './reducer';

type TRequestRole = {
  open: boolean;
};

export interface IModalStore {
  requestRole: TRequestRole;
}

export interface IShowRequestRoleAction {
  type: ModalActionsEnum.SHOW_REQUEST_ROLE;
}

export interface IHideRequestRoleAction {
  type: ModalActionsEnum.HIDE_REQUEST_ROLE;
}

export type TModalAction = IShowRequestRoleAction | IHideRequestRoleAction;
