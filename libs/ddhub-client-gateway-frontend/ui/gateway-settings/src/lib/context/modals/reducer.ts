import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_CERTIFICATE = 'SHOW_CERTIFICATE',
  SHOW_ROLES = 'SHOW_ROLES',
}

export const modalInitialState: IModalStore = {
  certificate: {
    open: false,
  },
  roles: {
    open: false,
    data: {
      namespace: '',
      did: '',
      roles: [],
    },
  },
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction,
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_CERTIFICATE:
      return { ...state, certificate: action.payload };
    case ModalActionsEnum.SHOW_ROLES:
      return { ...state, roles: action.payload };
  }
};
