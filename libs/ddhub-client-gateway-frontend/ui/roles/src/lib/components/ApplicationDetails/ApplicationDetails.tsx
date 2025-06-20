import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Typography } from '@mui/material';

export const ApplicationDetails = ({ namespace }: { namespace: string }) => {
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
          {namespace.split('.')[2]}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.gray[300]">
          Application:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {namespace.split('.')[0]}
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
