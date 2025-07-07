import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_REQUEST_ROLE = 'SHOW_REQUEST_ROLE',
  HIDE_REQUEST_ROLE = 'HIDE_REQUEST_ROLE',
}

export const modalInitialState: IModalStore = {
  requestRole: {
    open: false,
  },
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_REQUEST_ROLE:
      return { ...state, requestRole: { open: true } };
    case ModalActionsEnum.HIDE_REQUEST_ROLE:
      return { ...state, requestRole: { open: false } };
    default:
      return state;
  }
};
