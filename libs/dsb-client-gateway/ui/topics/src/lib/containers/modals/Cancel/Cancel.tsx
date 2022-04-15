import { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { AlertCircle } from 'react-feather';
import { useCancelEffects } from './Cancel.effects';
import { useStyles } from './Cancel.styles';

export const Cancel: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, handleCancel, handleConfirm } = useCancelEffects();
  return (
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      className={classes.root}
      classes={{ paper: classes.paper, container: classes.container }}
    >
      <AlertCircle style={{ width: '80px', height: '80px'}} className={classes.icon} />
      <DialogTitle className={classes.title}>Are you sure?</DialogTitle>
      <Typography variant="body2" className={classes.subTitle}>
      you will close create topic form
          </Typography>
      <DialogActions className={classes.actions}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          className={classes.button}
        >
          <Typography variant="body2" className={classes.cancelButtonText}>
            Cancel
          </Typography>
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={handleConfirm}
          className={classes.button}
        >
          <Typography variant="body2" className={classes.submitButtonText}>
            Confirm
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
