import { FC } from 'react';
import { Box } from '@mui/material';
import { UpdateChannelDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { getChannelTypeImage } from '../../utils';
import { useStyles } from './ChannelImage.styles';

interface ChannelImageProps {
  type: UpdateChannelDtoType;
  width?: number;
}

export const ChannelImage: FC<ChannelImageProps> = ({ type, width }) => {
  const { classes } = useStyles();
  const icon = getChannelTypeImage(type);
  return (
    <Box className={classes.imageWrapper}>
      <img width={width ?? 40} src={icon} alt="channel icon" />
    </Box>
  );
};
