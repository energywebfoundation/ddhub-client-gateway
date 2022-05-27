import { FC } from 'react';
import { ModalProvider } from '../../context';
import { ModalCenter } from '../modals/ModalCenter';
import { Settings } from '../Settings';

export const SettingsContainer: FC = () => {
  return (
    <ModalProvider>
      <Settings />
      <ModalCenter />
    </ModalProvider>
  );
};
