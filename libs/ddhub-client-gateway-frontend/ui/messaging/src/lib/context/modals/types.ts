import { ModalActionsEnum } from './reducer';

type TDetails = {
  open: boolean;
  data: {
    messageId: string;
    topicOwner: string;
    topicName: string;
    topicVersion: string;
    payload: string;
  }
};

export interface IModalStore {
  details: TDetails;
}

interface IShowDetailsAction {
  type: ModalActionsEnum.SHOW_DETAILS;
  payload: TDetails;
}


export type TModalAction = IShowDetailsAction
