import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Typography } from '@mui/material';
import { getApplicationNamespace, getOrganizationNamespace } from '../../utils';

export const ApplicationDetails = ({ namespace }: { namespace: string }) => {
  const [mainOrg, subOrg] = getOrganizationNamespace(namespace);
  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ marginBottom: 3 }}>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ marginBottom: 2 }}
      >
        Application details
      </Typography>
      <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.gray[300]">
          Organization:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${mainOrg} ${subOrg ? `> ${subOrg}` : ''}`}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.gray[300]">
          Application:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getApplicationNamespace(namespace)}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <Typography variant="body2" color="text.gray[300]">
          Application namespace:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {namespace}
        </Typography>
        <CopyToClipboard text={namespace} />
      </Box>
    </Box>
  );
};
