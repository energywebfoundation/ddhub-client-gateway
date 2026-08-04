import { ApiKeyResponseDtoWithStatus } from '../../components/ApiKeys/ApiKeys';
import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_ADD_API_KEY = 'SHOW_ADD_API_KEY',
  SHOW_UPDATE_API_KEY = 'SHOW_UPDATE_API_KEY',
}

export const modalInitialState: IModalStore = {
  addApiKey: {
    open: false,
  },
  updateApiKey: {
    open: false,
    data: undefined as unknown as ApiKeyResponseDtoWithStatus,
  },
};

export const modalsReducer = (
  state = modalInitialState,
  action: TModalAction
): IModalStore => {
  switch (action.type) {
    case ModalActionsEnum.SHOW_ADD_API_KEY:
      return { ...state, addApiKey: action.payload };
    case ModalActionsEnum.SHOW_UPDATE_API_KEY:
      return { ...state, updateApiKey: action.payload };
  }
};