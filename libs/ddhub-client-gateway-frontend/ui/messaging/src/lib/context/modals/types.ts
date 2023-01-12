import { ModalActionsEnum } from './reducer';
import { SendMessagelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

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

type TPostDetails = {
  open: boolean;
  data: SendMessagelResponseDto;
};

export interface IModalStore {
  details: TDetails;
  postDetails: TPostDetails;
}

interface IShowDetailsAction {
  type: ModalActionsEnum.SHOW_DETAILS;
  payload: TDetails;
}

interface IShowPostDetailsAction {
  type: ModalActionsEnum.SHOW_POST_DETAILS;
  payload: TPostDetails;
}

export type TModalAction = IShowDetailsAction | IShowPostDetailsAction;
