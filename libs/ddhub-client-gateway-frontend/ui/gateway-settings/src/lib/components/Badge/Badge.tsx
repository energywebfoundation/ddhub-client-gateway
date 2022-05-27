import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { useStyles } from './Badge.styles';

interface BadgeProps {
  text: string;
}

export const Badge: FC<BadgeProps> = ({ text }) => {
  const { classes, theme } = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Typography
        variant="body2"
        style={{ color: theme.palette.success.main }}
        className={classes.text}
      >
        {text}
      </Typography>
    </Box>
  );
};
