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

export interface IModalStore {
  details: TDetails;
  postDetails: TPostDetails;
  newMessage: TNewMessage;
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
  type: ModalActionsEnum.NEW_MESSAGE;
  payload: TNewMessage;
}

export type TModalAction =
  | IShowDetailsAction
  | IShowPostDetailsAction
  | IShowNewMessageAction;
