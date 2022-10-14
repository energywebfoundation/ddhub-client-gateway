import { ModalActionsEnum } from './reducer';
import { RoleDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

type TCertificate = {
  open: boolean;
};

type TRoles = {
  open: boolean;
  data: {
    namespace: string;
    did: string;
    roles: RoleDto[];
  };
};

export interface IModalStore {
  certificate: TCertificate;
  roles: TRoles;
}

interface IShowCertificateAction {
  type: ModalActionsEnum.SHOW_CERTIFICATE;
  payload: TCertificate;
}

interface IShowRolesAction {
  type: ModalActionsEnum.SHOW_ROLES;
  payload: TRoles;
}

export type TModalAction = IShowCertificateAction | IShowRolesAction;
