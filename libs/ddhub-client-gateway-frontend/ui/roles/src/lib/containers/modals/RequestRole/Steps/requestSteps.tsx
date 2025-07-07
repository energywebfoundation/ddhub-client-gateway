import { Search, Check, UserPlus, FileText } from 'react-feather';
import { TStep } from '@ddhub-client-gateway-frontend/ui/core';
import { Details } from '../RequestRole.effects';

export const REQUEST_ROLE_STEPS = (details: Details): TStep[] => [
  {
    title: 'Search',
    subtitle: 'Organization - application',
    icon: <Search size={18} />,
  },
  {
    title: 'Select new role',
    subtitle: null,
    icon: <UserPlus size={18} />,
    disabled: !details.namespace,
  },
  {
    title: 'Fill in role details',
    subtitle: null,
    icon: <FileText size={18} />,
    disabled: !details.role || !details.namespace,
  },
  {
    title: 'Review',
    subtitle: 'Review details for submission',
    icon: <Check size={18} />,
    disabled:
      !details.role ||
      !details.namespace ||
      !details.roleInfo.department ||
      !details.roleInfo.name ||
      !details.roleInfo.phone,
  },
];
