import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_CERTIFICATE = 'SHOW_CERTIFICATE',
  HIDE_CERTIFICATE = 'HIDE_CERTIFICATE',
}

export const modalInitialState: IModalStore = {
  certificate: {
    open: false,
    data: undefined,
  },
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_CERTIFICATE:
      return { ...state, certificate: action.payload };
    case ModalActionsEnum.HIDE_CERTIFICATE:
      return {
        ...state,
        certificate: { ...state.certificate, open: !action.payload },
      };
  }
};
