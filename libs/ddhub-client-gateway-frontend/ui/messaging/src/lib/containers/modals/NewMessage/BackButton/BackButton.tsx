import { FC } from 'react';
import { Button, ButtonProps, Typography } from '@mui/material';
import { useStyles } from './BackButton.styles';

export const BackButton: FC<ButtonProps> = (props) => {
  const { classes } = useStyles();
  return (
    <Button variant="outlined" className={classes.button} {...props}>
      <Typography className={classes.buttonText} variant="body2">
        Back
      </Typography>
    </Button>
  );
};
