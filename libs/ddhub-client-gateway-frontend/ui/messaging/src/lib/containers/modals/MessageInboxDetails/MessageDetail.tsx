import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useStyles } from './MessageInboxDetails.styles';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';

interface MessageDetailProps {
  field: {
    label: string;
    value: string;
    isEntryView?: boolean;
    copy?: boolean;
  };
}

export const MessageDetail: FC<MessageDetailProps> = ({
  field,
}: MessageDetailProps) => {
  const { classes } = useStyles();

  return (
    <Box display="flex">
      <Stack direction={field.isEntryView ? 'row' : 'column'}>
        <Box display="flex">
          <Typography
            className={field.isEntryView ? classes.labelText : classes.label}
            variant="body2"
            pr="14px"
          >
            {field.label}
            {field.isEntryView ? ':' : ''}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            className={field.isEntryView ? classes.label : classes.labelText}
            variant="body2"
          >
            {field.value}
          </Typography>
          {field.copy && <CopyToClipboard text={field.value} />}
        </Box>
      </Stack>
    </Box>
  );
};
