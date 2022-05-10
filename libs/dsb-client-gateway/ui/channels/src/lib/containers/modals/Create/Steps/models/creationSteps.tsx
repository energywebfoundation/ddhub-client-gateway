import { FileText, CreditCard, Check } from 'react-feather';

export const CREATION_STEPS: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}[] = [
  { title: 'Details', subtitle: 'Type · namespace', icon: <FileText size={18} /> },
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
  {
    title: 'Review',
    subtitle: 'Review details for submission',
    icon: <Check size={18} />,
  },
];
