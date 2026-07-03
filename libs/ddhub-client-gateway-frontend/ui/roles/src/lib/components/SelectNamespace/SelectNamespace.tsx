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
  type NamespaceOption = {
    name: string;
    namespace: string;
    appName: string;
    logoUrl: string;
    label: string;
  };

  const mappedOptions: NamespaceOption[] = options.map((option) => ({
    ...option,
    label: option.name,
  }));

  const selectedOption =
    mappedOptions.find((option) => option.namespace === namespace) ?? null;

  return (
    <Autocomplete
      options={mappedOptions}
      value={selectedOption}
      inputValue={searchKey}
      filterOptions={(availableOptions) => availableOptions}
      getOptionLabel={(option) => option.name ?? option.label ?? ''}
      isOptionEqualToValue={(option, value) =>
        option.namespace === value?.namespace
      }
      onChange={(_, value: NamespaceOption | null) => {
        if (value) {
          setNamespace(value.namespace);
          setSearchKey(value.name);
          return;
        }

        setNamespace('');
        setSearchKey('');
      }}
      noOptionsText={
        searchKey
          ? 'No results found. Try using different keywords.'
          : 'You need to provide at least 3 characters to start searching'
      }
      placeholder="Search by organization or application"
      onInputChange={(_, value, reason) => {
        if (reason === 'input' || reason === 'clear') {
          setSearchKey(value);
        }
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
    />
  );
};
