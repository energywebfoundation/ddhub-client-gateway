import { FileText, Check, Slash, MessageCircle } from 'react-feather';
import { TStep } from '@ddhub-client-gateway-frontend/ui/core';

export const CREATION_STEPS: TStep[] = [
  {
    title: 'Details',
    subtitle: 'Type · namespace',
    icon: <FileText size={18} />,
  },
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
  {
    title: 'Review',
    subtitle: 'Review details for submission',
    icon: <Check size={18} />,
  },
];
