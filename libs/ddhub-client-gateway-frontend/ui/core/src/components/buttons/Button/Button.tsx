import { FC } from 'react';
import clsx from 'clsx';
import {
  Box,
  CircularProgress,
  Typography,
  Button as MuiButton,
  ButtonProps,
} from '@mui/material';
import { useStyles } from './Button.styles';

export const Button: FC<
  ButtonProps & { secondary?: boolean; loading?: boolean; minWidth?: number }
> = (props) => {
  const { classes, theme } = useStyles();
  const { secondary = false, loading = false, ...rest } = props;
  return (
    <MuiButton
      {...rest}
      variant={props?.variant ?? 'contained'}
      sx={{ minWidth: props?.minWidth ?? 75 }}
      className={clsx(classes.button, {
        [classes.secondaryButton]: secondary,
      })}
    >
      {loading ? (
        <Box className={classes.progress}>
          <CircularProgress
            size={17}
            sx={{ color: theme.palette.common.white }}
          />
        </Box>
      ) : (
        <Typography
          className={clsx(classes.buttonText, {
            [classes.secondaryText]: secondary,
          })}
          variant="body2"
        >
          {props.children}
        </Typography>
      )}
    </MuiButton>
  );
};
