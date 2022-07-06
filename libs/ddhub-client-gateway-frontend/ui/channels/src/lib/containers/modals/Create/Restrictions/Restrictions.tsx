import { KeyboardEvent } from 'react';
import {
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { TextField } from '@ddhub-client-gateway-frontend/ui/core';
import { Plus, ChevronDown } from 'react-feather';
import { ChannelConditionsDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { RestrictionBox } from './RestrictionBox/RestrictionBox';
import { RestrictionType } from './models/restriction-type.enum';
import { ActionButtons } from '../ActionButtons';
import { TActionButtonsProps } from '../ActionButtons/ActionButtons';
import { useRestrictionsEffects } from './Restrictions.effects';
import { useStyles } from './Restrictions.styles';

export interface RestrictionsProps {
  restrictions: ChannelConditionsDto;
  actionButtonsProps: TActionButtonsProps;
}

export const Restrictions = ({
  actionButtonsProps,
  restrictions,
}: RestrictionsProps) => {
  const {
    type,
    dids,
    roles,
    didInput,
    roleInput,
    isDIDValid,
    isRoleValid,
    removeRole,
    removeDID,
    addRestriction,
    restrictionTypeChangeHandler,
    rolesInputChangeHandler,
    didInputChangeHandler,
    restrictionsCount,
  } = useRestrictionsEffects(restrictions);
  const { classes, theme } = useStyles();

  const selectRoleRestriction = type === RestrictionType.Role && (
    <TextField
      autoComplete='off'
      fullWidth
      variant={'outlined'}
      value={roleInput}
      onChange={(event) => {
        rolesInputChangeHandler(event.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <IconButton
              sx={{ padding: 0 }}
              disabled={!roleInput || !isRoleValid}
              onClick={() => addRestriction(roleInput)}
            >
              <Plus color={theme.palette.common.white} size={15} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={!isRoleValid}
      helperText={!isRoleValid ? 'Role format is invalid' : ''}
      onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          roleInput && isRoleValid && addRestriction(roleInput);
        }
      }}
    />
  );

  const setDIDRestriction = type === RestrictionType.DID && (
    <TextField
      autoComplete='off'
      fullWidth
      variant={'outlined'}
      value={didInput}
      onChange={(event) => {
        didInputChangeHandler(event.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <IconButton
              sx={{ padding: 0 }}
              disabled={!didInput || !isDIDValid}
              onClick={() => addRestriction(didInput)}
            >
              <Plus color={theme.palette.common.white} size={15} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={!isDIDValid}
      helperText={!isDIDValid ? 'DID format is invalid' : ''}
      onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          didInput && isDIDValid && addRestriction(didInput);
        }
      }}
    />
  );

  return (
    <Grid
      container
      direction="column"
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
      <Grid item alignSelf="flex-end" width="100%" sx={{ marginTop: '60px' }}>
        <ActionButtons
          {...actionButtonsProps}
          nextClickButtonProps={{
            ...actionButtonsProps.nextClickButtonProps,
            onClick: () =>
              actionButtonsProps.nextClickButtonProps.onClick({
                dids,
                roles,
              }),
          }}
        />
      </Grid>
    </Grid>
  );
};
