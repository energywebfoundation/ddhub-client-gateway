import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './AppNamespace.styles';

interface AppNamespaceProps {
  value: string;
}

export const AppNamespace: FC<AppNamespaceProps> = ({ value }) => {
  const { classes } = useStyles();
  return (
    <Box display="flex" alignItems="center">
      <Typography className={classes.namespace} noWrap>
        {value}
      </Typography>
      <CopyToClipboard text={value} />
    </Box>
  );
};
