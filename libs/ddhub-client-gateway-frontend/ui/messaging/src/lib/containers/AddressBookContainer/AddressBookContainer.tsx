import { FC } from 'react';
import { ModalProvider } from '../../context';
import { ModalsCenter } from '../modals/ModalsCenter';
import { AddressBookList } from '../../components';

export const AddressBookContainer: FC = () => {
  return (
    <ModalProvider>
      <AddressBookList />
      <ModalsCenter />
    </ModalProvider>
  );
};
