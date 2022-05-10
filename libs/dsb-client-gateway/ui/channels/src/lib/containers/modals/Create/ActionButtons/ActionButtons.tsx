import { FC } from 'react';
import { Box, ButtonProps } from '@mui/material';
import { ActionButton } from '../ActionButton';
import { BackButton } from '../BackButton';

interface ActionButtonsProps extends ButtonProps {
  nextClick: () => void;
  goBack: () => void;
  loading?: boolean;
}

export const ActionButtons: FC<ActionButtonsProps> = ({
  goBack,
  nextClick,
  type,
  loading,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <BackButton onClick={goBack} />
      <ActionButton onClick={nextClick} type={type} loading={loading} />
    </Box>
  );
};
