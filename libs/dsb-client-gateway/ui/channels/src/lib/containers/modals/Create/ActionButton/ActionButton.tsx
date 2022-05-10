import { FC } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  Typography,
  CircularProgress,
} from '@mui/material';
import { ChevronRight } from 'react-feather';
import { useStyles } from './ActionButton.styles';

export const ActionButton: FC<ButtonProps & { loading?: boolean }> = (props) => {
  const { classes, theme } = useStyles();
  const loading = props.loading ?? false;
  const isSubmitButton = props.type === 'submit';

  return (
    <Button
      type={props.type ?? 'button'}
      variant="contained"
      className={classes.button}
      classes={{ endIcon: classes.buttonIcon }}
      endIcon={
        isSubmitButton ? null : (
          <ChevronRight size={14} color={theme.palette.common.white} />
        )
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
          {isSubmitButton ? 'Submit' : 'Next'}
        </Typography>
      )}
    </Button>
  );
};
