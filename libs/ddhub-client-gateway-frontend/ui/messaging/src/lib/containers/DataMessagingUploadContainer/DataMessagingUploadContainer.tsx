import { FC } from 'react';
import { ModalsCenter } from '../modals/ModalsCenter';
import { ModalProvider } from '../../context';
import {
  DataMessagingUpload,
  DataMessagingUploadProps,
} from '@ddhub-client-gateway-frontend/ui/messaging';

export const DataMessagingUploadContainer: FC<DataMessagingUploadProps> = (
  props,
) => {
  return (
    <ModalProvider>
      <DataMessagingUpload isLarge={props.isLarge} />
      <ModalsCenter />
    </ModalProvider>
  );
};
