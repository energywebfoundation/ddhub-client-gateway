import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { UpdateChannelDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ChannelConnectionType } from '../../models/channel-connection-type.enum';
import { ChannelImage } from '../ChannelImage';
import { useStyles } from './ChannelType.styles';

interface ChannelTypeProps {
  value: UpdateChannelDtoType;
}

export const ChannelType: FC<ChannelTypeProps> = ({ value }) => {
  const { classes } = useStyles();

  return (
    <Box display="flex" alignItems="center" m={'5px 0'}>
      <ChannelImage type={value} imageWidth={25} />
      <Typography variant="body2" className={classes.text}>
        {ChannelConnectionType[value]}
      </Typography>
    </Box>
  );
};
