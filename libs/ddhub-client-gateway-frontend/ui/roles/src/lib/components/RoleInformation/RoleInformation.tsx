import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Typography } from '@mui/material';
import { Details } from '../../containers/modals/RequestRole/RequestRole.effects';
export const RoleInformation = ({
  namespace,
  role,
  roleInfo,
}: {
  namespace: string;
  role: string;
  roleInfo: Details['roleInfo'];
}) => {
  console.log(role);
  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ marginBottom: 3 }}>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textTransform: 'capitalize' }}
      >
        {role} information
      </Typography>
      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <Typography variant="body2" color="text.gray[300]">
          Role namespace:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {namespace}
        </Typography>
        <CopyToClipboard text={namespace} />
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <Typography variant="body2" color="text.gray[300]">
          Name:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {roleInfo.name}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <Typography variant="body2" color="text.gray[300]">
          Department:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {roleInfo.department}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <Typography variant="body2" color="text.gray[300]">
          Phone number:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {roleInfo.phone}
        </Typography>
      </Box>
    </Box>
  );
};
