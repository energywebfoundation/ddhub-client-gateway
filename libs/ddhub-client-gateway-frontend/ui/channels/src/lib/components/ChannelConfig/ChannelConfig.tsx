import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Check } from 'react-feather';
import { useStyles } from './ChannelConfig.styles';

export interface ChannelConfigProps {
  value: {
    payloadEncryption: boolean;
    useAnonymousExtChannel: boolean;
    messageForms: boolean;
  };
}

interface ConfigBoxProps {
  configText: string;
}

const ConfigBox = (props: ConfigBoxProps) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.box}>
      <Box className={classes.iconBox}>
        <Check size={11} color="#2EB67D" />
      </Box>
      <Typography className={classes.text}>{props.configText}</Typography>
    </Box>
  );
};

export const ChannelConfig: FC<ChannelConfigProps> = ({ value }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      gap="5px"
    >
      {value.useAnonymousExtChannel && (
        <ConfigBox configText="Anonymous channel" />
      )}

      {value.payloadEncryption && <ConfigBox configText="Payload encryption" />}

      {value.messageForms && <ConfigBox configText="Message forms" />}
    </Box>
  );
};
