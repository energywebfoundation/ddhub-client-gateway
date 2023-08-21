import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Check } from 'react-feather';
import { useStyles } from './ChannelConfig.styles';

export interface ChannelConfigProps {
  value: string[];
}

export const ChannelConfig: FC<ChannelConfigProps> = ({ value }) => {
  const { classes } = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      gap="5px"
    >
      <Box className={classes.box}>
        <Box className={classes.iconBox}>
          <Check size={11} color="#2EB67D" />
        </Box>
        <Typography className={classes.text}>Anonymous channel</Typography>
      </Box>
      <Box className={classes.box}>
        <Box className={classes.iconBox}>
          <Check size={11} color="#2EB67D" />
        </Box>
        <Typography className={classes.text}>Payload encryption</Typography>
      </Box>
      <Box className={classes.box}>
        <Box className={classes.iconBox}>
          <Check size={11} color="#2EB67D" />
        </Box>
        <Typography className={classes.text}>Message forms</Typography>
      </Box>
    </Box>
  );
};
