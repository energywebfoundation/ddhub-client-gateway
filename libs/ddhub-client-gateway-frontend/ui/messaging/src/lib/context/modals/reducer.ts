import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_DETAILS = 'SHOW_DETAILS',
  SHOW_POST_DETAILS = 'SHOW_POST_DETAILS',
  NEW_MESSAGE = 'NEW_MESSAGE',
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
  newMessage: {
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
    case ModalActionsEnum.NEW_MESSAGE:
      return { ...state, newMessage: action.payload };
  }
};
