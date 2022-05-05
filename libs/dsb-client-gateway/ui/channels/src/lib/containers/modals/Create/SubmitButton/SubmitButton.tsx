import { FC } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { ChevronRight } from 'react-feather';
import { useStyles } from './SubmitButton.styles';

export const SubmitButton: FC<ButtonProps> = (props) => {
  const { classes, theme } = useStyles();
  return (
    <Button
      type="submit"
      variant="contained"
      className={classes.button}
      classes={{ endIcon: classes.buttonIcon }}
      endIcon={<ChevronRight size={14} color={theme.palette.common.white} />}
      {...props}
    >
      Next
    </Button>
  );
};
