import { ModalActionsEnum } from './reducer';
import { SendMessagelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

type TDetails = {
  open: boolean;
  data: {
    messageId: string;
    topicOwner: string;
    topicName: string;
    topicVersion: string;
    payload: string;
  };
};

type TPostDetails = {
  open: boolean;
  data: SendMessagelResponseDto;
};

type TNewMessage = {
  open: boolean;
  data: any;
};

type TViewMessage = {
  open: boolean;
  data: any;
};

export interface IModalStore {
  details: TDetails;
  postDetails: TPostDetails;
  newMessage: TNewMessage;
  viewMessage: TViewMessage;
}

interface IShowDetailsAction {
  type: ModalActionsEnum.SHOW_DETAILS;
  payload: TDetails;
}

interface IShowPostDetailsAction {
  type: ModalActionsEnum.SHOW_POST_DETAILS;
  payload: TPostDetails;
}

interface IShowNewMessageAction {
  type: ModalActionsEnum.SHOW_NEW_MESSAGE;
  payload: TNewMessage;
}

interface IShowViewMessageAction {
  type: ModalActionsEnum.SHOW_VIEW_MESSAGE;
  payload: TViewMessage;
}

export type TModalAction =
  | IShowDetailsAction
  | IShowPostDetailsAction
  | IShowNewMessageAction
  | IShowViewMessageAction;
