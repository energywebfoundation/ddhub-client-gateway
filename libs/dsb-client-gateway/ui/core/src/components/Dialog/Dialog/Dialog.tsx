import { useStyles } from './Dialog.styles';
import {Dialog as MuiDialog} from '@mui/material';

export interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
}

export const Dialog = ({ children, onClose, open }: DialogProps) => {
  const { classes } = useStyles();
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      fullWidth
      className={classes.root}
      classes={{ paper: classes.paper, container: classes.container }}
      style={{ visibility: !open ? 'hidden' : 'visible' }}
    >
      {children}
    </MuiDialog>
  );
};
