import { FC } from 'react';
import { Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useStyles } from './CloseButton.styles';

export interface CloseButtonProps {
  onClose: () => void;
}

export const CloseButton: FC<CloseButtonProps> = ({ onClose }) => {
  const { classes } = useStyles();
  return (
    <Box display="flex" justifyContent="flex-end">
      <IconButton className={classes.closeIcon} onClick={onClose}>
        <Close />
      </IconButton>
    </Box>
  );
};
