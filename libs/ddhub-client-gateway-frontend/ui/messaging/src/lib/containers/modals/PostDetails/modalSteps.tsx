import { Check } from 'react-feather';
import { AlertIcon, TStep } from '@ddhub-client-gateway-frontend/ui/core';

export const MODAL_STEPS: TStep[] = [
  {
    title: 'Sent',
    subtitle: 'Successfully sent message',
    icon: <Check size={21} />,
  },
  {
    title: 'Failed',
    subtitle: 'Message not sent',
    icon: <AlertIcon />,
  },
];
