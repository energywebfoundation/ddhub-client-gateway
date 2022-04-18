import { ITopicsModalsStore, TTopicsModalsAction } from './types';

export enum TopicsModalsActionsEnum {
  SHOW_CREATE_TOPIC = 'SHOW_CREATE_TOPIC',
  SHOW_UPDATE_TOPIC = 'SHOW_UPDATE_TOPIC',
  HIDE_CREATE_TOPIC = 'HIDE_CREATE_TOPIC',
  SHOW_CANCEL = 'SHOW_CANCEL',
}

export const topicsModalsInitialState: ITopicsModalsStore = {
  createTopic: {
    open: false,
    hide: false,
    application: null,
  },
  updateTopic: {
    open: false,
    hide: false,
    topic: null,
    application: null,
  },
  cancel: {
    open: false,
    onConfirm: null,
    onCancel: null,
  },
};

export const topicsModalsReducer = (
  state = topicsModalsInitialState,
  action: TTopicsModalsAction
): ITopicsModalsStore => {
  switch (action.type) {
    case TopicsModalsActionsEnum.SHOW_CREATE_TOPIC:
      return { ...state, createTopic: action.payload };
    case TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC:
      return { ...state, updateTopic: action.payload };
    case TopicsModalsActionsEnum.HIDE_CREATE_TOPIC:
      return {
        ...state,
        createTopic: { ...state.createTopic, hide: action.payload },
      };
    case TopicsModalsActionsEnum.SHOW_CANCEL:
      return { ...state, cancel: action.payload };
  }
};
