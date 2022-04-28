import { Box } from '@mui/material';
import { Image } from 'react-feather';
import { useStyles } from './AppImage.styles';

interface AppImageProps {
  src: string;
  className?: string;
}

interface AppImageWithWrapperProps {
  value: string;
}

export const AppImage = ({ src, className }: AppImageProps) => {
  const { classes, theme } = useStyles();
  return src ? (
    <img
      className={className ?? classes.image}
      src={src}
      key={src}
      alt="app icon"
    />
  ) : (
    <Image
      style={{ stroke: theme.palette.grey[400] }}
      className={className ?? classes.image}
    />
  );
};

export const AppImageWithWrapper = ({
  value: logoUrl,
}: AppImageWithWrapperProps) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.wrapper}>
      <AppImage src={logoUrl} />
    </Box>
  );
};
