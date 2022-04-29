import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_CREATE = 'SHOW_CREATE',
  SHOW_UPDATE = 'SHOW_UPDATE',
  SHOW_DETAILS = 'SHOW_DETAILS',
  HIDE_UPDATE = 'HIDE_UPDATE',
  HIDE_CREATE = 'HIDE_CREATE',
}

export const modalInitialState: IModalStore = {
  create: {
    open: false,
  },
  update: {
    open: false,
    data: undefined
  },
  details: {
    open: false,
    data: undefined
  },
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_CREATE:
      return { ...state, create: action.payload };
    case ModalActionsEnum.SHOW_UPDATE:
      return { ...state, update: action.payload };
    case ModalActionsEnum.SHOW_DETAILS:
      return { ...state, details: action.payload };
    case ModalActionsEnum.HIDE_CREATE:
      return {
        ...state,
        create: { ...state.create, open: !action.payload },
      };
    case ModalActionsEnum.HIDE_UPDATE:
      return {
        ...state,
        update: { ...state.update },
      };
  }
};
