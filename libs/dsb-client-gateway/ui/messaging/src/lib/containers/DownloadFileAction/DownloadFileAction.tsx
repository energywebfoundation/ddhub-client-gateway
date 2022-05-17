import { FC } from 'react';
import { Stack, Box } from '@mui/material';
import { ChannelInfo } from '@dsb-client-gateway/ui/channels';
import { GenericTable } from '@dsb-client-gateway/ui/core';
// import { useMessageEffects } from './Message.effects';

interface DownloadActionProps {
  value: string;
  onClick: (fileId: string) => void;
  downloadData: {
    loading: boolean;
    fileId: string;
  };
}

export const DownloadFileAction: FC<DownloadActionProps> = ({
  value,
  downloadData,
  onClick,
}) => {
 console.log(downloadData, value, 'action')
  return (
    <div onClick={() => onClick(value)}>
      {downloadData.loading && downloadData.fileId === value
        ? 'loading'
        : 'download'}
    </div>
  )
}
