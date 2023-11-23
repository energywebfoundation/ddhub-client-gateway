import { FC } from 'react';
import { ModalProvider } from '../../context';
import { ModalsCenter } from '../modals/ModalsCenter';
import { RelatedMessageOutbox } from '../RelatedMessageOutbox/RelatedMessageOutbox';

export const RelatedMessageOutboxContainer: FC = () => {
  return (
    <ModalProvider>
      <RelatedMessageOutbox />
      <ModalsCenter />
    </ModalProvider>
  );
};
