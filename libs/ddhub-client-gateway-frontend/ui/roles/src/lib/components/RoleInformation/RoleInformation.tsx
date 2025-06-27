import {
  CopyToClipboard,
  EditorView,
} from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Typography } from '@mui/material';
import { FieldDefinitionDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ScrollableBox } from '../ScrollableBox/ScrollableBox';
export const RoleInformation = ({
  namespace,
  role,
  fields,
  formData,
}: {
  namespace: string;
  role: string;
  fields: FieldDefinitionDTO[];
  formData: Record<string, any>;
}) => {
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

      <ScrollableBox maxHeight="220px">
        {fields.map((field) => {
          if (field.fieldType === 'json') {
            return (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={2}
              >
                <Typography variant="body2" color="text.gray[300]">
                  {field.label}:
                </Typography>
                <EditorView value={formData[field.label].toString()} />
              </Box>
            );
          }
          return (
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.gray[300]">
                {field.label}:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData[field.label].toString()}
              </Typography>
            </Box>
          );
        })}
      </ScrollableBox>
    </Box>
  );
};
