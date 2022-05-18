import { FC } from 'react';
import { Download } from 'react-feather';
import { CircularProgress, IconButton } from '@mui/material';
import { TMessage } from '../Messages/Messages.type';
import { useDownloadMessageEffects } from './DownloadMessage.effects';
import { useStyles } from './DownloadMessage.styles';

export interface DownloadMessageProps {
  value: TMessage['fileData'];
}

export const DownloadMessage: FC<DownloadMessageProps> = ({ value }) => {
  const { classes, theme } = useStyles();
  const { downloadMessageHandler, isDownloading, data } =
    useDownloadMessageEffects({ value });

  return (
    <div>
      {isDownloading ? (
        <CircularProgress
          size={17}
          sx={{ color: theme.palette.primary.main }}
        />
      ) : (
        <IconButton sx={{ padding: 0 }} onClick={() => downloadMessageHandler(data)}>
          <Download className={classes.icon} />
        </IconButton>
      )}
    </div>
  );
};
