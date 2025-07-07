import { Box } from '@mui/material';
import { ApplicationDetails, RoleInformation } from '../../../../components';
import { Details } from '../RequestRole.effects';
import { FieldDefinitionDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const RequestSummary = ({
  details: { namespace, role, roleInfo },
  roles,
  formData,
  fields,
}: {
  details: Details;
  roles: {
    role: string;
    namespace: string;
  }[];
  fields: FieldDefinitionDTO[];
  formData: Record<string, any>;
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <ApplicationDetails namespace={namespace} />
      <RoleInformation
        namespace={role}
        role={roles?.find((r) => r.namespace === role)?.role ?? ''}
        fields={fields}
        formData={formData}
      />
    </Box>
  );
};
