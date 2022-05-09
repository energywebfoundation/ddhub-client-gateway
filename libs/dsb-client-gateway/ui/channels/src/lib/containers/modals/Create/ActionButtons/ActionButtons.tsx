import { FC } from 'react';
import { Box, ButtonProps } from '@mui/material';
import { ActionButton } from '../ActionButton';
import { BackButton } from '../BackButton';

interface ActionButtonsProps extends ButtonProps {
  nextClick: () => void;
  goBack?: () => void;
  loading?: boolean;
  submitButtonText?: string;
}

export const ActionButtons: FC<ActionButtonsProps> = ({
  goBack,
  nextClick,
  loading,
  submitButtonText,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      {goBack && <BackButton onClick={goBack} />}
      <ActionButton onClick={nextClick} loading={loading}>
        {submitButtonText ?? 'Next'}
      </ActionButton>
    </Box>
  );
};
