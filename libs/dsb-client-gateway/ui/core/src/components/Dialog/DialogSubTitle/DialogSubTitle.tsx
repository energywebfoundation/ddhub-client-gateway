import { DialogContentText } from '@mui/material';
import { useStyles } from './DialogSubTitle.styles';

export interface DialogSubTitleProps {
  children: React.ReactNode;
}

export const DialogSubTitle = ({ children }: DialogSubTitleProps) => {
  const { classes } = useStyles();
  return (
    <DialogContentText className={classes.subTitle}>
      {children}
    </DialogContentText>
  );
};
