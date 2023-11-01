import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_DETAILS = 'SHOW_DETAILS',
  SHOW_POST_DETAILS = 'SHOW_POST_DETAILS',
  SHOW_MESSAGE_INBOX_DETAILS = 'SHOW_MESSAGE_INBOX_DETAILS',
  SHOW_ADD_CONTACT = 'SHOW_ADD_CONTACT',
  SHOW_UPDATE_CONTACT = 'SHOW_UPDATE_CONTACT',
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
    data: undefined,
  },
  addContact: {
    open: false,
  },
  updateContact: {
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
    case ModalActionsEnum.SHOW_ADD_CONTACT:
      return { ...state, addContact: action.payload };
    case ModalActionsEnum.SHOW_UPDATE_CONTACT:
      return { ...state, updateContact: action.payload };
  }
};
