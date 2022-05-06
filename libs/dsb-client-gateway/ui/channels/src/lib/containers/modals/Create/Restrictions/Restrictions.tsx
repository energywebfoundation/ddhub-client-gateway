import { KeyboardEvent } from 'react';
import {
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { Plus, ChevronDown } from 'react-feather';
import { RestrictionBox } from './RestrictionBox/RestrictionBox';
import { SubmitButton } from '../SubmitButton';
import { Autocomplete } from '@dsb-client-gateway/ui/core';
import { RestrictionType } from './models/restriction-type.enum';
import { useRestrictionsEffects } from './Restrictions.effects';
import { useStyles } from './Restrictions.styles';

export interface RestrictionsProps {
  nextClick: (value: { dids: string[]; roles: string[] }) => void;
}

export const Restrictions = ({ nextClick }: RestrictionsProps) => {
  const {
    type,
    dids,
    roles,
    didInput,
    possibleRoles,
    isDIDValid,
    removeRole,
    removeDID,
    addRestriction,
    restrictionTypeChangeHandler,
    rolesInputChangeHandler,
    didInputChangeHandler,
    restrictionsCount,
  } = useRestrictionsEffects();
  const { classes, theme } = useStyles();

  const selectRoleRestriction = type === RestrictionType.Role && (
    <Autocomplete
      options={possibleRoles}
      onChange={(_event, newInputValue) => {
        addRestriction(newInputValue);
      }}
      placeholder="Search for roles..."
      onTextChange={(event: any) => rolesInputChangeHandler(event.target.value)}
    />
  );

  const setDIDRestriction = type === RestrictionType.DID && (
    <TextField
      fullWidth
      variant={'outlined'}
      value={didInput}
      classes={{ root: classes.textField }}
      onChange={(event) => {
        didInputChangeHandler(event.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="start"
            onClick={() => didInput && addRestriction(didInput)}
            sx={{ cursor: 'pointer' }}
          >
            <Plus color={theme.palette.common.white} size={15} />
          </InputAdornment>
        ),
      }}
      error={!isDIDValid}
      helperText={!isDIDValid ? 'DID format is invalid' : ''}
      onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          didInput && addRestriction(didInput);
        }
      }}
    />
  );

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      className={'no-wrap'}
      sx={{ height: '100%', flexWrap: 'nowrap' }}
    >
      <Grid item>
        <Grid container spacing={2}>
          <Grid item sx={{ marginBottom: '22px' }}>
            <InputLabel id="restriction-type" className={classes.label}>
              Restrictions
            </InputLabel>
            <Select
              labelId="restriction-type"
              value={type}
              IconComponent={ChevronDown}
              classes={{
                icon: classes.icon,
              }}
              className={classes.select}
              onChange={(d: SelectChangeEvent<RestrictionType>) => {
                restrictionTypeChangeHandler(d.target.value as RestrictionType);
              }}
              sx={{ width: '100px' }}
            >
              <MenuItem
                value={RestrictionType.DID}
                className={classes.menuItem}
              >
                {RestrictionType.DID}
              </MenuItem>
              <MenuItem
                value={RestrictionType.Role}
                className={classes.menuItem}
              >
                {RestrictionType.Role}
              </MenuItem>
            </Select>
          </Grid>
          <Grid
            item
            alignSelf="flex-end"
            flexGrow="1"
            sx={{ marginBottom: '22px' }}
          >
            {selectRoleRestriction}
            {setDIDRestriction}
          </Grid>
        </Grid>
        <Box>
          <Typography className={classes.label}>
            {restrictionsCount} Restrictions
          </Typography>
        </Box>
        <Box display="flex">
          <RestrictionBox
            type={RestrictionType.DID}
            list={dids}
            remove={removeDID}
            wrapperProps={{ mr: 0.75 }}
          />
          <RestrictionBox
            type={RestrictionType.Role}
            list={roles}
            remove={removeRole}
            wrapperProps={{ ml: 0.75 }}
          />
        </Box>
      </Grid>
      <Grid item alignSelf="flex-end">
        <SubmitButton onClick={() => nextClick({ dids, roles })}>
          Next
        </SubmitButton>
      </Grid>
    </Grid>
  );
};
