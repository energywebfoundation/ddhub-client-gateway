import { Check } from 'react-feather';
import { TStep } from '@ddhub-client-gateway-frontend/ui/core';
import { SmsOutlined, TextSnippetOutlined } from '@mui/icons-material';

export const MODAL_STEPS: TStep[] = [
  {
    title: 'Select channel and topic',
    subtitle: 'Reference - channel - topic',
    icon: <TextSnippetOutlined />,
  },
  {
    title: 'New message',
    subtitle: 'Create new message',
    icon: <SmsOutlined />,
  },
  {
    title: 'Review',
    subtitle: 'Review details for submission',
    icon: <Check size={21} />,
  },
];
