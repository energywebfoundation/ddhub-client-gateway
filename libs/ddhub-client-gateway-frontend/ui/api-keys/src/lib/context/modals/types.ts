import { ModalActionsEnum } from './reducer';
import { ApiKeyResponseDtoWithStatus } from '../../components/ApiKeys/ApiKeys';

type TAddApiKey = {
  open: boolean;
};

type TUpdateApiKey = {
  open: boolean;
  data: ApiKeyResponseDtoWithStatus;
};

export interface IModalStore {
  addApiKey: TAddApiKey;
  updateApiKey: TUpdateApiKey;
}

interface IShowAddApiKeyAction {
  type: ModalActionsEnum.SHOW_ADD_API_KEY;
  payload: TAddApiKey;
}

interface IShowUpdateApiKeyAction {
  type: ModalActionsEnum.SHOW_UPDATE_API_KEY;
  payload: TUpdateApiKey;
}

export type TModalAction =
  | IShowAddApiKeyAction
  | IShowUpdateApiKeyAction;
