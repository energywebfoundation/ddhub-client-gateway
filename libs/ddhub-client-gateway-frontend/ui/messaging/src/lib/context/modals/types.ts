import { ModalActionsEnum } from './reducer';
import {
  GetAllContactsResponseDto,
  SendMessagelResponseDto,
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
  };
};

type TPostDetails = {
  open: boolean;
  data: SendMessagelResponseDto;
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

interface IShowMessageInboxDetailsAction {
  type: ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS;
  payload: TInboxDetails;
}

interface IShowAddContactAction {
  type: ModalActionsEnum.SHOW_ADD_CONTACT;
  payload: TAddContact;
}

interface IShowUpdateContactAction {
  type: ModalActionsEnum.SHOW_UPDATE_CONTACT;
  payload: TUpdateContact;
}

export type TModalAction =
  | IShowDetailsAction
  | IShowPostDetailsAction
  | IShowMessageInboxDetailsAction
  | IShowAddContactAction
  | IShowUpdateContactAction;
