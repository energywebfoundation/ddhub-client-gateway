import { FC } from 'react';
import { ModalProvider } from '../../context';
import { ModalsCenter } from '../modals/ModalsCenter';
import { ApiKeysList } from '../../components/ApiKeys';

export const ApiKeysContainer: FC = () => {
  return (
    <ModalProvider>
      <ApiKeysList />
      <ModalsCenter />
    </ModalProvider>
  );
};