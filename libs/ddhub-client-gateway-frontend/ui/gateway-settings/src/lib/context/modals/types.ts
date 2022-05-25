import { ModalActionsEnum } from './reducer';

type TCertificate = {
  open: boolean;
};

export interface IModalStore {
  certificate: TCertificate;
}

interface IShowCertificateAction {
  type: ModalActionsEnum.SHOW_CERTIFICATE;
  payload: TCertificate;
}

export type TModalAction = IShowCertificateAction;
