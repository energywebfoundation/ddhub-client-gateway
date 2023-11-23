import { IModalStore, TModalAction } from './types';

export enum ModalActionsEnum {
  SHOW_CREATE = 'SHOW_CREATE',
  SHOW_UPDATE = 'SHOW_UPDATE',
  SHOW_DETAILS = 'SHOW_DETAILS',
  SHOW_TOPIC_DETAILS = 'SHOW_TOPIC_DETAILS',
  SHOW_TOPIC_VERSION_DETAILS = 'SHOW_TOPIC_VERSION_DETAILS',
  HIDE_UPDATE = 'HIDE_UPDATE',
  HIDE_CREATE = 'HIDE_CREATE',
  HIDE_DETAILS = 'HIDE_DETAILS',
  HIDE_TOPIC_VERSION_DETAILS = 'HIDE_TOPIC_VERSION_DETAILS',
}

export const modalInitialState: IModalStore = {
  create: {
    open: false,
  },
  update: {
    open: false,
    data: undefined,
  },
  details: {
    open: false,
    data: undefined,
  },
  topicDetails: {
    open: false,
    data: undefined,
  },
  topicVersionDetails: {
    open: false,
    data: undefined,
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
    case ModalActionsEnum.SHOW_TOPIC_DETAILS:
      return { ...state, topicDetails: action.payload };
    case ModalActionsEnum.HIDE_CREATE:
      return {
        ...state,
        create: { ...state.create, open: !action.payload },
      };
    case ModalActionsEnum.HIDE_UPDATE:
      return {
        ...state,
        update: { ...state.update, open: !action.payload },
      };
    case ModalActionsEnum.HIDE_DETAILS:
      return { ...state,
        details: { ...state.details, open: !action.payload},
      };
    case ModalActionsEnum.SHOW_TOPIC_VERSION_DETAILS:
      return { ...state, topicVersionDetails: action.payload };
    case ModalActionsEnum.HIDE_TOPIC_VERSION_DETAILS:
      return {
        ...state,
        topicVersionDetails: {...state.topicVersionDetails, open: !action.payload}
      }
  }
};
