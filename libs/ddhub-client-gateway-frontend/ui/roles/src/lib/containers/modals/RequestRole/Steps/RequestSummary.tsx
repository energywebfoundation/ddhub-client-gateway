import { Box } from '@mui/material';
import { ApplicationDetails, RoleInformation } from '../../../../components';
import { Details } from '../RequestRole.effects';

export const RequestSummary = ({
  details: { namespace, role, roleInfo },
  roles,
}: {
  details: Details;
  roles: { role: string; namespace: string }[];
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <ApplicationDetails namespace={namespace} />
      <RoleInformation
        namespace={role}
        role={roles?.find((r) => r.namespace === role)?.role ?? ''}
        roleInfo={roleInfo}
      />
    </Box>
  );
};
