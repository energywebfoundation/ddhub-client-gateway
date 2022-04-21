import { ITopicsModalsStore, TTopicsModalsAction } from './types';

export enum TopicsModalsActionsEnum {
  SHOW_CREATE_TOPIC = 'SHOW_CREATE_TOPIC',
  SHOW_UPDATE_TOPIC = 'SHOW_UPDATE_TOPIC',
  HIDE_UPDATE_TOPIC = 'HIDE_UPDATE_TOPIC',
  HIDE_CREATE_TOPIC = 'HIDE_CREATE_TOPIC',
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
    case TopicsModalsActionsEnum.HIDE_UPDATE_TOPIC:
      return {
        ...state,
        updateTopic: { ...state.updateTopic, hide: action.payload },
      };
  }
};