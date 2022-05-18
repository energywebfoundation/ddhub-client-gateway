import {
  GetTopicDto,
  ApplicationDTO,
  GetChannelResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum } from './reducer';

type TCreate = {
  open: boolean;
};

type TUpdate = {
  open: boolean;
  data: GetChannelResponseDto;
};

type TDetails = {
  open: boolean;
  data: GetChannelResponseDto;
};

type TTopicDetails = {
  open: boolean;
  data: {
    topic: GetTopicDto;
    application: ApplicationDTO;
  };
};

export interface IModalStore {
  create: TCreate;
  update: TUpdate;
  details: TDetails;
  topicDetails: TTopicDetails;
}

interface IShowCreateAction {
  type: ModalActionsEnum.SHOW_CREATE;
  payload: TCreate;
}

interface IShowUpdateAction {
  type: ModalActionsEnum.SHOW_UPDATE;
  payload: TUpdate;
}

interface IShowDetailsAction {
  type: ModalActionsEnum.SHOW_DETAILS;
  payload: TDetails;
}

interface IShowTopicDetailsAction {
  type: ModalActionsEnum.SHOW_TOPIC_DETAILS;
  payload: TTopicDetails;
}

interface IHideCreateAction {
  type: ModalActionsEnum.HIDE_CREATE;
  payload: boolean;
}

interface IHideUpdateAction {
  type: ModalActionsEnum.HIDE_UPDATE;
  payload: boolean;
}

export type TModalAction =
  | IShowCreateAction
  | IShowUpdateAction
  | IHideCreateAction
  | IHideUpdateAction
  | IShowDetailsAction
  | IShowTopicDetailsAction;
