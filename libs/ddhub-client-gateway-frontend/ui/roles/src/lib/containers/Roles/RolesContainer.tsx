import { RoleList } from '../../components';
import { ModalProvider } from '../../context';
import { Modals } from '../modals';

export function RolesContainer() {
  return (
    <ModalProvider>
      <RoleList />
      <Modals />
    </ModalProvider>
  );
}
