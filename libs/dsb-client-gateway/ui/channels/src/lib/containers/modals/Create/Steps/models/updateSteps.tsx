import { CreditCard } from 'react-feather';
import { TStep } from './types'



export const UPDATE_STEPS: TStep[] = [
  {
    title: 'Restrictions',
    subtitle: 'Add restrictions by searching',
    icon: <CreditCard size={18} />,
  },
  {
    title: 'Topics',
    subtitle: 'Add topics by searching',
    icon: <CreditCard size={18} />,
  },
];
