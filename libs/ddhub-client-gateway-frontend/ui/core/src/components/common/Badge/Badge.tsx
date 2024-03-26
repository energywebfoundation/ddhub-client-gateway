import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { useStyles } from './Badge.styles';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'error';
}

export const Badge: FC<BadgeProps> = ({ text, variant }) => {
  const { classes, theme } = useStyles();
  const color =
    !variant || variant === 'success'
      ? theme.palette.success.main
      : theme.palette.error.main;
  const wrapperClass =
    !variant || variant === 'success'
      ? classes.successWrapper
      : classes.errorWrapper;
  return (
    <Box className={wrapperClass}>
      <Typography className={classes.text} style={{ color }} variant="body2">
        {text}
      </Typography>
    </Box>
  );
};
