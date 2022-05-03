import { Check, CreditCard, Description } from '@mui/icons-material';

export const CREATION_STEPS: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}[] = [
  { title: 'Details', subtitle: 'Type · namespace', icon: <Description /> },
  {
    title: 'Restrictions',
    subtitle: 'Add restrictions by searching',
    icon: <CreditCard />,
  },
  {
    title: 'Topics',
    subtitle: 'Add topics by searching',
    icon: <CreditCard />,
  },
  {
    title: 'Review',
    subtitle: 'Review details for submission',
    icon: <Check />,
  },
];
