import { ModalActionsEnum } from './reducer';
import {
  GetAllContactsResponseDto,
  SendMessageResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

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
    messageId: string;
    topicOwner: string;
    topicName: string;
    topicVersion: string;
    payload: string;
    timestamp: string;
    timestampNanos: number;
    isSender: boolean;
  };
};

type TPostDetails = {
  open: boolean;
  data: SendMessageResponseDto;
};

type TNewMessage = {
  open: boolean;
  data: any;
};

type TViewMessage = {
  open: boolean;
  data: any;
};

type TAddContact = {
  open: boolean;
};

type TUpdateContact = {
  open: boolean;
  data: GetAllContactsResponseDto;
};

export interface IModalStore {
  details: TDetails;
  postDetails: TPostDetails;
  inboxDetails: TInboxDetails;
  newMessage: TNewMessage;
  viewMessage: TViewMessage;
  addContact: TAddContact;
  updateContact: TUpdateContact;
}

interface IShowDetailsAction {
  type: ModalActionsEnum.SHOW_DETAILS;
  payload: TDetails;
}

interface IShowPostDetailsAction {
  type: ModalActionsEnum.SHOW_POST_DETAILS;
  payload: TPostDetails;
}

interface IShowAddContactAction {
  type: ModalActionsEnum.SHOW_ADD_CONTACT;
  payload: TAddContact;
}

interface IShowUpdateContactAction {
  type: ModalActionsEnum.SHOW_UPDATE_CONTACT;
  payload: TUpdateContact;
}

interface IShowMessageInboxDetailsAction {
  type: ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS;
  payload: TInboxDetails;
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
  | IShowMessageInboxDetailsAction
  | IShowNewMessageAction
  | IShowViewMessageAction
  | IShowAddContactAction
  | IShowUpdateContactAction;
