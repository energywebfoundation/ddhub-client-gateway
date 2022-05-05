import { Box } from '@mui/material';
import { Image as ImageIcon } from 'react-feather';
import { useStyles } from './Image.styles';

interface ImageProps {
  src: string;
  className?: string;
}

interface ImageWithWrapperProps {
  value: string;
}

export const Image = ({ src, className }: ImageProps) => {
  const { classes, theme } = useStyles();
  return src ? (
    <img
      className={className ?? classes.image}
      src={src}
      key={src}
      alt="app icon"
    />
  ) : (
    <ImageIcon
      style={{ stroke: theme.palette.grey[400] }}
      className={className ?? classes.image}
    />
  );
};

export const ImageWithWrapper = ({
  value: logoUrl,
}: ImageWithWrapperProps) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Image src={logoUrl} />
    </Box>
  );
};
