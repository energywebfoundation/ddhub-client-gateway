import { MessageCircle, Slash } from 'react-feather';
import { TStep } from './types';

export const VIEW_STEPS: TStep[] = [
  {
    title: 'Restrictions',
    subtitle: 'Channel restrictions',
    icon: <Slash size={18} />,
  },
  {
    title: 'Topics',
    subtitle: 'Channel topics',
    icon: <MessageCircle size={18} />,
  },
];
