import { FC } from 'react';
import { Box, BoxProps } from '@mui/material';
import { UpdateChannelDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { getChannelTypeImage } from '../../utils';
import { useStyles } from './ChannelImage.styles';

interface ChannelImageProps {
  type: UpdateChannelDtoType;
  imageWidth?: number;
  wrapperProps?: BoxProps;
}

export const ChannelImage: FC<ChannelImageProps> = ({
  type,
  imageWidth,
  wrapperProps,
}) => {
  const { classes } = useStyles();
  const icon = getChannelTypeImage(type);
  return (
    <Box
      width={42}
      height={42}
      className={classes.imageWrapper}
      {...wrapperProps}
    >
      <img width={imageWidth ?? 40} src={icon} alt="channel icon" />
    </Box>
  );
};
