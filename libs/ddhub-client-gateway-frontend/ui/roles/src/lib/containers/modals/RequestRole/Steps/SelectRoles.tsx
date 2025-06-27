import { alpha, Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Minus, Plus, Check } from 'react-feather';
import { ApplicationDetails, ScrollableBox } from '../../../../components';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';

const getIcon = ({
  isSelected,
  isSynced,
}: {
  isSelected: boolean;
  isSynced: boolean;
}) => {
  if (isSynced) {
    return <Check size={16} color={theme.palette.success.main} />;
  }
  if (isSelected) {
    return <Minus size={16} />;
  }
  return <Plus size={16} />;
};

export const SelectRoles = ({
  namespace,
  role,
  toggleRole,
  roles,
  myRoles,
}: {
  namespace: string;
  role: string;
  toggleRole: (role: string) => void;
  roles: { role: string; namespace: string }[];
  myRoles: { role: string; namespace: string }[];
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <ApplicationDetails namespace={namespace} />
      <Divider
        sx={{
          margin: '10px 0',
          borderColor: alpha(theme.palette.grey[600], 0.35),
        }}
      />

      <Box display="flex" flexDirection="column">
        <Typography
          sx={{ marginBottom: 3, marginTop: 3 }}
          variant="body1"
          color="text.secondary"
        >
          Select a role
        </Typography>

        <ScrollableBox maxHeight={200}>
          {roles.map((availableRole) => {
            const isSelected = role === availableRole.namespace;
            const isSynced = myRoles.some(
              (myRole) => myRole.namespace === availableRole.namespace
            );

            return (
              <Box key={availableRole.role}>
                <Button
                  variant={isSelected ? 'contained' : 'outlined'}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '4px 0',
                  }}
                  onClick={
                    isSynced
                      ? undefined
                      : () => toggleRole(availableRole.namespace)
                  }
                >
                  <Typography
                    variant="button"
                    sx={{ textTransform: 'lowercase' }}
                    color="text.secondary"
                  >
                    {availableRole.role}
                  </Typography>
                  <Box
                    sx={{ width: 80, textTransform: 'capitalize' }}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    {getIcon({ isSelected, isSynced })}
                    {isSynced ? (
                      <Typography
                        variant="body2"
                        color={theme.palette.text.secondary}
                        sx={{ marginLeft: 1 }}
                      >
                        Synced
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        color={
                          isSelected ? undefined : theme.palette.text.secondary
                        }
                        sx={{ marginLeft: 1 }}
                      >
                        Request
                      </Typography>
                    )}
                  </Box>
                </Button>
              </Box>
            );
          })}
        </ScrollableBox>
      </Box>
    </Box>
  );
};
