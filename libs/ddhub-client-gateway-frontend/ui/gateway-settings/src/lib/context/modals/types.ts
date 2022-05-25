import { ModalActionsEnum } from './reducer';

type TCertificate = {
  open: boolean;
  data: undefined;
};

export interface IModalStore {
  certificate: TCertificate;
}

interface IShowCertificateAction {
  type: ModalActionsEnum.SHOW_CERTIFICATE;
  payload: TCertificate;
}

interface IHideCertificateAction {
  type: ModalActionsEnum.HIDE_CERTIFICATE;
  payload: boolean;
}

export type TModalAction = IShowCertificateAction | IHideCertificateAction;
