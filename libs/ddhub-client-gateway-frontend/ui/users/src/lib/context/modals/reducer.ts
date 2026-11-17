import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_CREATE = 'SHOW_CREATE',
  HIDE_CREATE = 'HIDE_CREATE',
  SHOW_UPDATE = 'SHOW_UPDATE',
  HIDE_UPDATE = 'HIDE_UPDATE',
}

export const modalInitialState: IModalStore = {
  create: {
    open: false,
  },
  update: {
    open: false,
    payload: null,
  },
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_CREATE:
      return { ...state, create: { open: true } };
    case ModalActionsEnum.HIDE_CREATE:
      return { ...state, create: { open: false } };
    case ModalActionsEnum.SHOW_UPDATE:
      return {
        ...state,
        update: { open: true, payload: action.payload },
      };
    case ModalActionsEnum.HIDE_UPDATE:
      return { ...state, update: { open: false, payload: null } };
    default:
      return state;
  }
};
