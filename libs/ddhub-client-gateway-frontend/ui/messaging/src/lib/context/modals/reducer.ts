import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_DETAILS = 'SHOW_DETAILS',
  SHOW_POST_DETAILS = 'SHOW_POST_DETAILS',
  SHOW_MESSAGE_INBOX_DETAILS = 'SHOW_MESSAGE_INBOX_DETAILS',
  SHOW_NEW_MESSAGE = 'SHOW_NEW_MESSAGE',
  SHOW_ADD_CONTACT = 'SHOW_ADD_CONTACT',
  SHOW_UPDATE_CONTACT = 'SHOW_UPDATE_CONTACT',
  SHOW_RECIPIENT_LIST = 'SHOW_RECIPIENT_LIST',
}

export const modalInitialState: IModalStore = {
  details: {
    open: false,
    data: undefined,
  },
  postDetails: {
    open: false,
    data: undefined,
  },
  inboxDetails: {
    open: false,
    ackMessage: undefined,
    data: undefined,
  },
  newMessage: {
    open: false,
    data: undefined,
  },
  addContact: {
    open: false,
  },
  updateContact: {
    open: false,
    data: undefined,
  },
  recipientList: {
    open: false,
    data: undefined,
  },
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_DETAILS:
      return { ...state, details: action.payload };
    case ModalActionsEnum.SHOW_POST_DETAILS:
      return { ...state, postDetails: action.payload };
    case ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS:
      return { ...state, inboxDetails: action.payload };
    case ModalActionsEnum.SHOW_NEW_MESSAGE:
      return { ...state, newMessage: action.payload };
    case ModalActionsEnum.SHOW_ADD_CONTACT:
      return { ...state, addContact: action.payload };
    case ModalActionsEnum.SHOW_UPDATE_CONTACT:
      return { ...state, updateContact: action.payload };
    case ModalActionsEnum.SHOW_RECIPIENT_LIST:
      return { ...state, recipientList: action.payload };
  }
};
