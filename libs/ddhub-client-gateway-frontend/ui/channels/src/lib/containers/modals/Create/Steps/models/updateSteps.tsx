import { MessageCircle, Slash } from 'react-feather';
import { TStep } from '@ddhub-client-gateway-frontend/ui/core';

export const UPDATE_STEPS: TStep[] = [
  {
    title: 'Restrictions',
    subtitle: 'Add restrictions by searching',
    icon: <Slash size={18} />,
  },
  {
    title: 'Topics',
    subtitle: 'Add topics by searching',
    icon: <MessageCircle size={18} />,
  },
];
