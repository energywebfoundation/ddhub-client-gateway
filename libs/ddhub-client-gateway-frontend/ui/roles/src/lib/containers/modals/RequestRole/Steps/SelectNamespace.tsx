import { Autocomplete } from '@ddhub-client-gateway-frontend/ui/core';
import { darken } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { Grid } from 'react-feather';

export const SelectNamespaceStep = ({
  namespace,
  setNamespace,
  options,
  searchKey,
  setSearchKey,
}: {
  namespace: string;
  setNamespace: (value: string) => void;
  options: {
    name: string;
    namespace: string;
    appName: string;
    logoUrl: string;
  }[];
  searchKey: string;
  setSearchKey: (value: string) => void;
}) => {
  return (
    <Autocomplete
      options={options.map((option) => ({
        ...option,
        label: option.name,
      }))}
      onChange={(_, value) => {
        setNamespace(value?.namespace);
      }}
      placeholder="Search"
      onInputChange={(_, value) => {
        setSearchKey(value);
      }}
      label="Search by organization or application"
      renderOption={(
        props,
        option: {
          name: string;
          namespace: string;
          appName: string;
          logoUrl: string;
        }
      ) => {
        const index = props['data-option-index'];
        const name = option.name;
        return (
          <Box
            gap={2}
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={(theme) => ({
              padding: [theme.spacing(2), theme.spacing(2)],
              backgroundColor:
                index % 2 === 0
                  ? theme.palette.background.paper
                  : darken(theme.palette.background.paper, 0.05),
            })}
            {...props}
          >
            <Grid size={16} />
            <Box display="flex" flexDirection="column">
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  textTransform: 'capitalize',
                }}
              >
                {name}
              </Typography>
              <Typography variant="body2" color="gray[600]">
                {option.namespace}
              </Typography>
            </Box>
          </Box>
        );
      }}
      value={namespace}
    />
  );
};
