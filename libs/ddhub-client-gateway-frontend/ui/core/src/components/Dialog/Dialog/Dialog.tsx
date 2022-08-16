import { useStyles } from './Dialog.styles';
import { Dialog as MuiDialog } from '@mui/material';
import clsx from 'clsx';

export interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  paperClassName?: string;
}

export const Dialog = ({
  children,
  onClose,
  open,
  paperClassName,
}: DialogProps) => {
  const { classes } = useStyles();
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      fullWidth
      className={classes.root}
      classes={{
        paper: clsx(paperClassName ?? classes.paper, classes.defaultPaper),
        container: classes.container,
      }}
      style={{ visibility: !open ? 'hidden' : 'visible' }}
    >
      {children}
    </MuiDialog>
  );
};
