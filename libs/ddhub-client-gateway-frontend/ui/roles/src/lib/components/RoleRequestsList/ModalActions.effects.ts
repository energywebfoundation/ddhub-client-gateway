import {
  TTableComponentAction,
  useCustomAlert,
} from '@ddhub-client-gateway-frontend/ui/core';
import { fakeRoleRequestsData } from './RoleRequestsList.effects';
import { useTheme } from '@mui/material/styles';

export enum ModalActionType {
  APPROVE = 'approve',
  REJECT = 'reject',
  REVOKE = 'revoke',
}
export enum ModalActionStatus {
  INIT = 'init',
  IN_PROGRESS = 'in progress',
  FAILED = 'failed',
}

const approveRoleRequest = ({ fqcn }: { fqcn: string }) => {
  console.log('approve ' + fqcn);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

const rejectRoleRequest = ({ fqcn }: { fqcn: string }) => {
  console.log('reject ' + fqcn);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
const revokeRoleRequest = ({ fqcn }: { fqcn: string }) => {
  console.log('revoke ' + fqcn);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

const getModalConfig = (
  actionType: ModalActionType,
  actionStatus: ModalActionStatus
) => {
  if (actionStatus === ModalActionStatus.INIT) {
    return {
      title:
        actionType === ModalActionType.APPROVE
          ? 'Confirm role approval'
          : actionType === ModalActionType.REJECT
          ? 'Confirm role rejection'
          : 'Confirm role revocation',
      text:
        actionType === ModalActionType.APPROVE
          ? 'Are you sure you want to approve the role assignment to the user?'
          : actionType === ModalActionType.REJECT
          ? 'Are you sure you want to reject the role assignment to the user?'
          : 'Are you sure you want to revoke the role assignment to the user?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning' as const,
    };
  }
  if (actionStatus === ModalActionStatus.IN_PROGRESS) {
    return {
      title:
        actionType === ModalActionType.APPROVE
          ? 'Role approval in progress'
          : actionType === ModalActionType.REJECT
          ? 'Role rejection in progress'
          : 'Role revocation in progress',
      text:
        actionType === ModalActionType.APPROVE
          ? "The user's role assignment is currently under review."
          : actionType === ModalActionType.REJECT
          ? "The user's role is currently being rejected."
          : "The user's role is currently being revoked.",
      confirmButtonText: 'OK',
      type: 'success' as const,
    };
  }
  if (actionStatus === ModalActionStatus.FAILED) {
    return {
      title:
        actionType === ModalActionType.APPROVE
          ? 'Role approval failed'
          : actionType === ModalActionType.REJECT
          ? 'Role rejection failed'
          : 'Role revocation failed',
      text:
        actionType === ModalActionType.APPROVE
          ? 'The role assignment for this user could not be approved. Please try again.'
          : actionType === ModalActionType.REJECT
          ? 'The role assignment for this user could not be rejected. Please try again.'
          : 'The role assignment for this user could not be revoked. Please try again.',
      showCancelButton: true,
      confirmButtonText: 'Try again',
      type: 'warning' as const,
    };
  }
  // Default case for unexpected action status
  throw new Error(`Unexpected modal action status: ${actionStatus}`);
};

export const useModalActionsEffects = () => {
  const Swal = useCustomAlert();
  const theme = useTheme();

  const actions: TTableComponentAction<typeof fakeRoleRequestsData[0]>[] = [
    {
      label: 'Approve',
      onClick: async ({ fqcn }) => {
        const result = await Swal.fire(
          getModalConfig(ModalActionType.APPROVE, ModalActionStatus.INIT)
        );
        if (result.isConfirmed) {
          try {
            await approveRoleRequest({ fqcn });
            await Swal.fire(
              getModalConfig(
                ModalActionType.APPROVE,
                ModalActionStatus.IN_PROGRESS
              )
            );
          } catch (error) {
            console.error(error);
            await Swal.fire(
              getModalConfig(ModalActionType.APPROVE, ModalActionStatus.FAILED)
            );
          }
        }
      },
    },
    {
      label: 'Reject',
      onClick: async ({ fqcn }) => {
        const result = await Swal.fire(
          getModalConfig(ModalActionType.REJECT, ModalActionStatus.INIT)
        );
        if (result.isConfirmed) {
          try {
            await rejectRoleRequest({ fqcn });
            await Swal.fire(
              getModalConfig(
                ModalActionType.REJECT,
                ModalActionStatus.IN_PROGRESS
              )
            );
          } catch (error) {
            console.error(error);
            await Swal.fire(
              getModalConfig(ModalActionType.REJECT, ModalActionStatus.FAILED)
            );
          }
        }
      },
      color: theme.palette.error.main,
    },
    {
      label: 'Revoke',
      onClick: async ({ fqcn }) => {
        const result = await Swal.fire(
          getModalConfig(ModalActionType.REVOKE, ModalActionStatus.INIT)
        );
        if (result.isConfirmed) {
          try {
            await revokeRoleRequest({ fqcn });
            await Swal.fire(
              getModalConfig(
                ModalActionType.REVOKE,
                ModalActionStatus.IN_PROGRESS
              )
            );
          } catch (error) {
            console.error(error);
            await Swal.fire(
              getModalConfig(ModalActionType.REVOKE, ModalActionStatus.FAILED)
            );
          }
        }
      },
      color: theme.palette.error.main,
    },
  ];

  return actions;
};
