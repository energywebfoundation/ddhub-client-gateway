import { ModalActionsEnum } from './reducer';

type TCreate = {
  open: boolean;
};

type TUpdate = {
  open: boolean;
  payload: {
    username: string;
    password: string;
  } | null;
};

export interface IModalStore {
  create: TCreate;
  update: TUpdate;
}

export interface IShowCreateAction {
  type: ModalActionsEnum.SHOW_CREATE;
}

export interface IHideCreateAction {
  type: ModalActionsEnum.HIDE_CREATE;
}

export interface IShowUpdateAction {
  type: ModalActionsEnum.SHOW_UPDATE;
  payload: TUpdate['payload'];
}

export interface IHideUpdateAction {
  type: ModalActionsEnum.HIDE_UPDATE;
}

export type TModalAction =
  | IShowCreateAction
  | IHideCreateAction
  | IShowUpdateAction
  | IHideUpdateAction;
