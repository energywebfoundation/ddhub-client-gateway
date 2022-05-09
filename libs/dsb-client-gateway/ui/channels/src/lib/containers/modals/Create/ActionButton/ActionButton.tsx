import { FC } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  ButtonProps,
  Typography,
  CircularProgress,
} from '@mui/material';
import { ChevronRight } from 'react-feather';
import { useStyles } from './ActionButton.styles';

export type TActionButton = {
  onClick: (data?: any) => void,
  text?: string;
  showArrowIcon?: boolean;
  loading?: boolean;
}

export const ActionButton: FC<ButtonProps & TActionButton> = (props) => {
  const { classes, theme } = useStyles();
  const { loading = false} = props;

  return (
    <Button
      type="submit"
      variant="contained"
      className={clsx(classes.button, {[classes.center]: !props.showArrowIcon })}
      classes={{ endIcon: classes.buttonIcon }}
      endIcon={
        props.showArrowIcon ? (
          <ChevronRight size={14} color={theme.palette.common.white} />
        ) : null
      }
      {...props}
    >
      {loading ? (
        <Box width="100%" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress
            size={17}
            sx={{ color: theme.palette.common.white }}
          />
        </Box>
      ) : (
        <Typography className={classes.buttonText} variant="body2">
          {props.children}
        </Typography>
      )}
    </Button>
  );
};
