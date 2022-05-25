import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_CERTIFICATE = 'SHOW_CERTIFICATE',
}

export const modalInitialState: IModalStore = {
  certificate: {
    open: false,
  },
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_CERTIFICATE:
      return { ...state, certificate: action.payload };
  }
};
