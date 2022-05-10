import { FC } from 'react';
import { Box } from '@mui/material';
import { ActionButton, TActionButton } from '../ActionButton';
import { BackButton } from '../BackButton';
import { CancelButton } from '../CancelButton';

export type TActionButtonsProps = {
  nextClickButtonProps: TActionButton;
  goBack?: () => void;
  onCancel?: () => void;
}

export const ActionButtons: FC<TActionButtonsProps> = ({
  goBack,
  onCancel,
  nextClickButtonProps,
}) => {
  const { text, ...nextButtonProps } = nextClickButtonProps;

  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      {goBack && <BackButton onClick={goBack} color="secondary" />}
      {onCancel && <CancelButton onClick={onCancel} />}
      <ActionButton {...nextButtonProps}>
        {nextClickButtonProps.text}
      </ActionButton>
    </Box>
  );
};
