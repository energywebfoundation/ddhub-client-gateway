import { FC } from 'react';
import clsx from 'clsx';
import {
  Box,
  BoxProps,
  Typography,
  Button as MuiButton,
  ButtonProps,
} from '@mui/material';
import { useStyles } from './Button.styles';

// interface ButtonProps {}

export const Button: FC<ButtonProps & { secondary?: boolean }> = (props) => {
  const { classes } = useStyles();
  const { secondary = false, ...rest } = props;
  return (
    <MuiButton
    {...rest}
      variant={props?.variant ?? 'contained'}
      className={clsx(classes.button, {
        [classes.secondaryButton]: secondary,
      })}
    >
      <Typography className={clsx(classes.buttonText, {
        [classes.secondaryText]: secondary,
      })} variant="body2">
        {props.children}
      </Typography>
    </MuiButton>
  );
};
