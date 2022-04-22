import {
  ApplicationDTO,
  GetTopicDto,
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
  topic: GetTopicDto;
  application: ApplicationDTO;
};

type TTopicDetails = {
  open: boolean;
  topic: GetTopicDto;
  application: ApplicationDTO;
};

export interface ITopicsModalsStore {
  createTopic: TCreateTopic;
  updateTopic: TUpdateTopic;
  topicDetails: TTopicDetails;
}

interface IShowCreateTopicAction {
  type: TopicsModalsActionsEnum.SHOW_CREATE_TOPIC;
  payload: TCreateTopic;
}

interface IShowUpdateTopicAction {
  type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC;
  payload: TUpdateTopic;
}

interface IShowTopicDetailsAction {
  type: TopicsModalsActionsEnum.SHOW_TOPIC_DETAILS;
  payload: TTopicDetails;
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
  | IHideUpdateTopicAction
  | IShowTopicDetailsAction;
