import { ModalProvider } from '../../context/modals/provider';
import { UserList } from '../../components/UserList/UserList';
import { Modals } from '../modals/index';

export function UsersContainer() {
  return (
    <ModalProvider>
      <UserList />
      <Modals />
    </ModalProvider>
  );
}
