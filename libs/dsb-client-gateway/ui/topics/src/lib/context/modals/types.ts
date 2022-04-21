import {
  ApplicationDTO,
  PostTopicDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { TopicsModalsActionsEnum } from './reducer';

type TCreateTopic = {
  open: boolean;
  hide: boolean;
  application: ApplicationDTO;
};

type TUpdateTopic = {
  open: boolean;
  hide: boolean;
  topic: PostTopicDto;
  application: ApplicationDTO;
};

export interface ITopicsModalsStore {
  createTopic: TCreateTopic;
  updateTopic: TUpdateTopic;
}

interface IShowCreateTopicAction {
  type: TopicsModalsActionsEnum.SHOW_CREATE_TOPIC;
  payload: TCreateTopic;
}

interface IShowUpdateTopicAction {
  type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC;
  payload: TUpdateTopic;
}

interface IHideCreateTopicAction {
  type: TopicsModalsActionsEnum.HIDE_CREATE_TOPIC;
  payload: boolean;
}

interface IHideUpdateTopicAction {
  type: TopicsModalsActionsEnum.HIDE_UPDATE_TOPIC;
  payload: boolean;
}

export type TTopicsModalsAction =
  | IShowCreateTopicAction
  | IShowUpdateTopicAction
  | IHideCreateTopicAction
  | IHideUpdateTopicAction;
