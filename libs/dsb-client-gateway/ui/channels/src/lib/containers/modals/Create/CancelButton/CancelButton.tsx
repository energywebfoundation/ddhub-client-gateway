import { FC } from 'react';
import { Button, ButtonProps, Typography } from '@mui/material';
import { useStyles } from './CancelButton.styles';

export const CancelButton: FC<ButtonProps> = (props) => {
  const { classes } = useStyles();
  return (
    <Button variant="outlined" className={classes.button} {...props}>
      <Typography className={classes.buttonText} variant="body2">
        Cancel
      </Typography>
    </Button>
  );
};
