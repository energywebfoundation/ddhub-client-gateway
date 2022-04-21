import { Box } from '@mui/material';
import { useStyles } from './AppImage.styles';

interface AppImageProps {
  value: string;
}

export const AppImage = ({ value: logoUrl }: AppImageProps) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.wrapper}>
      <img
        className={classes.image}
        src={logoUrl}
        key={logoUrl}
        alt="app icon"
      />
    </Box>
  );
};
