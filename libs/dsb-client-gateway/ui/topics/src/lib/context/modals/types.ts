import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client'
import { TopicsModalsActionsEnum } from './reducer';

export interface ITopicsModalsStore {
  createTopic: {
    open: boolean;
    hide: boolean;
    application: ApplicationDTO;
  };
  cancel: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }
}

interface IShowCreateTopicAction {
  type: TopicsModalsActionsEnum.SHOW_CREATE_TOPIC;
  payload: {
    open: boolean;
    hide: boolean;
    application: ApplicationDTO;
  };
}

interface IHideCreateTopicAction {
  type: TopicsModalsActionsEnum.HIDE_CREATE_TOPIC;
  payload: boolean;
}

interface IShowCancelAction {
  type: TopicsModalsActionsEnum.SHOW_CANCEL;
  payload: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }
}

export type TTopicsModalsAction =
  | IShowCreateTopicAction
  | IHideCreateTopicAction
  | IShowCancelAction
