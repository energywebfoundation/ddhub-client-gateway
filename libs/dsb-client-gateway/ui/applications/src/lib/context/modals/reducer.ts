import { IApplicationsModalsStore, TApplicationsModalsAction } from './types';

export enum ApplicationsModalsActionsEnum {
  SHOW_CREATE_TOPIC = 'SHOW_CREATE_TOPIC',
  HIDE_CREATE_TOPIC = 'HIDE_CREATE_TOPIC',
  SHOW_CANCEL = 'SHOW_CANCEL',
}

export const applicationsModalsInitialState: IApplicationsModalsStore = {
  createTopic: {
    open: false,
    hide: false,
    application: null,
  },
  cancel: {
    open: false,
    onConfirm: null,
    onCancel: null,
  },
};

export const applicationsModalsReducer = (
  state = applicationsModalsInitialState,
  action: TApplicationsModalsAction
): IApplicationsModalsStore => {
  switch (action.type) {
    case ApplicationsModalsActionsEnum.SHOW_CREATE_TOPIC:
      return { ...state, createTopic: action.payload };
    case ApplicationsModalsActionsEnum.HIDE_CREATE_TOPIC:
      return {
        ...state,
        createTopic: { ...state.createTopic, hide: action.payload },
      };
    case ApplicationsModalsActionsEnum.SHOW_CANCEL:
      return { ...state, cancel: action.payload };
  }
};
