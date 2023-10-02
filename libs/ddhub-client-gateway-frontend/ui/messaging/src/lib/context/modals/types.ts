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

type TInboxDetails = {
  open: boolean;
  data: {
    channelName: string;
    transactionId: string;
    // instructionId: string; // todo: check var name
    // instructionCreateDt: string; // todo: check var name
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

export interface IModalStore {
  details: TDetails;
  postDetails: TPostDetails;
  inboxDetails: TInboxDetails;
}

interface IShowDetailsAction {
  type: ModalActionsEnum.SHOW_DETAILS;
  payload: TDetails;
}

interface IShowPostDetailsAction {
  type: ModalActionsEnum.SHOW_POST_DETAILS;
  payload: TPostDetails;
}

interface IShowMessageInboxDetailsAction {
  type: ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS;
  payload: TInboxDetails;
}

export type TModalAction =
  | IShowDetailsAction
  | IShowPostDetailsAction
  | IShowMessageInboxDetailsAction;
