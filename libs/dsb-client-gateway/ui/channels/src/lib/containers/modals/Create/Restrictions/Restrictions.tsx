import {
  Button,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useRestrictionsEffects } from './Restrictions.effects';
import { RestrictionBox } from './RestrictionBox/RestrictionBox';
import { Autocomplete } from '@mui/lab';
import { Plus } from 'react-feather';
import { theme } from '@dsb-client-gateway/ui/utils';
import { RestrictionType } from './models/restriction-type.enum';
import { KeyboardEvent } from 'react';

export interface RestrictionsProps {
  nextClick: (value: { dids: string[]; roles: string[] }) => void;
}

export const Restrictions = ({ nextClick }: RestrictionsProps) => {
  const {
    type,
    dids,
    roles,
    didInput,
    roleInput,
    possibleRoles,
    isDIDValid,
    removeRole,
    removeDID,
    addRestriction,
    restrictionTypeChangeHandler,
    rolesInputChangeHandler,
    didInputChangeHandler,
  } = useRestrictionsEffects();

  const selectRoleRestriction = type === RestrictionType.Role && (
    <Autocomplete
      disablePortal
      options={possibleRoles}
      inputValue={roleInput}
      onInputChange={(_event, newInputValue) => {
        rolesInputChangeHandler(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search for roles..." />
      )}
    />
  );

  const setDIDRestriction = type === RestrictionType.DID && (
    <TextField
      fullWidth
      variant={'outlined'}
      value={didInput}
      onChange={(event) => {
        didInputChangeHandler(event.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="start"
            onClick={() => addRestriction(didInput)}
            sx={{ cursor: 'pointer' }}
          >
            <Plus color={theme.palette.common.white} />
          </InputAdornment>
        ),
      }}
      error={!isDIDValid}
      helperText={!isDIDValid ? 'DID format is invalid' : ''}
      onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          addRestriction(didInput);
        }
      }}
    />
  );

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      justifyContent="space-between"
      className={'no-wrap'}
      sx={{ height: '100%', flexWrap: 'nowrap' }}
    >
      <Grid item>
        <Grid container spacing={2}>
          <Grid item sx={{marginBottom: isDIDValid ? '0px' : '22px'}}>
            <InputLabel id="restriction-type">Restrictions</InputLabel>
            <Select
              labelId="restriction-type"
              value={type}
              onChange={(d: SelectChangeEvent<RestrictionType>) => {
                restrictionTypeChangeHandler(d.target.value as RestrictionType);
              }}
              sx={{ width: '100px' }}
            >
              <MenuItem value={RestrictionType.DID}>
                {RestrictionType.DID}
              </MenuItem>
              <MenuItem value={RestrictionType.Role}>
                {RestrictionType.Role}
              </MenuItem>
            </Select>
          </Grid>
          <Grid item alignSelf="flex-end" flexGrow="1">
            {selectRoleRestriction}
            {setDIDRestriction}
          </Grid>
        </Grid>
        <RestrictionBox
          type={RestrictionType.DID}
          list={dids}
          remove={removeDID}
        />
        <RestrictionBox
          type={RestrictionType.Role}
          list={roles}
          remove={removeRole}
        />
      </Grid>
      <Grid item alignSelf="flex-end">
        <Button
          type="submit"
          variant="contained"
          onClick={() => nextClick({ dids, roles })}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};
