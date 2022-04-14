import { ApplicationDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client'
import { ApplicationsModalsActionsEnum } from './reducer';

export interface IApplicationsModalsStore {
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
  type: ApplicationsModalsActionsEnum.SHOW_CREATE_TOPIC;
  payload: {
    open: boolean;
    hide: boolean;
    application: ApplicationDTO;
  };
}

interface IHideCreateTopicAction {
  type: ApplicationsModalsActionsEnum.HIDE_CREATE_TOPIC;
  payload: boolean;
}

interface IShowCancelAction {
  type: ApplicationsModalsActionsEnum.SHOW_CANCEL;
  payload: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }
}

export type TApplicationsModalsAction =
  | IShowCreateTopicAction
  | IHideCreateTopicAction
  | IShowCancelAction
