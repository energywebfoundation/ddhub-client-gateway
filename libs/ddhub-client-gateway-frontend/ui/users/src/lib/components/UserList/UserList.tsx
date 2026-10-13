import {
  CreateButton,
  GenericTable,
} from '@ddhub-client-gateway-frontend/ui/core';
import { USERS_HEADERS } from '../../models/users-headers';
import { useUserListEffects } from './UserList.effects';

export function UserList() {
  const { users, actions, onCreateHandler, isLoading } = useUserListEffects();

  return (
    <div>
      <GenericTable
        headers={USERS_HEADERS}
        tableRows={users}
        actions={actions}
        loading={isLoading}
      >
        <CreateButton onCreate={onCreateHandler} buttonText="New user" />
      </GenericTable>
    </div>
  );
}
