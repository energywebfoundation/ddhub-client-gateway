import { Search, Check, FileText } from 'react-feather';
import { TStep } from '@ddhub-client-gateway-frontend/ui/core';
import { Details } from '../RequestRole.effects';
import { FieldDefinitionDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const REQUEST_ROLE_STEPS = (
  details: Details,
  requestorFields: FieldDefinitionDTO[]
): TStep[] =>
  [
    {
      title: 'Search',
      subtitle: 'Organization - application',
      icon: <Search size={18} />,
      id: 'search',
    },
    requestorFields.length > 0
      ? {
          title: 'Details',
          subtitle: 'Fill in role details',
          icon: <FileText size={18} />,
          disabled: !details.role || !details.namespace,
          id: 'details',
        }
      : null,
    {
      title: 'Review',
      subtitle: 'Review details for submission',
      icon: <Check size={18} />,
      disabled: !details.role || !details.namespace,
      id: 'review',
    },
  ].filter(Boolean);
