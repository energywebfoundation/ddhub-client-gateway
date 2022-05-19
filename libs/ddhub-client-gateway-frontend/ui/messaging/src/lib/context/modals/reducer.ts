import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_DETAILS = 'SHOW_DETAILS',
}

export const modalInitialState: IModalStore = {
  details: {
    open: false,
    data: undefined,
  }
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_DETAILS:
      return { ...state, details: action.payload };
  }
};
