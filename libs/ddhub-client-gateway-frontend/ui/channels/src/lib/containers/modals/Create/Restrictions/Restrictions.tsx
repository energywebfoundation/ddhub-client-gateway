import { Box, Grid, InputLabel, Select, Typography } from '@mui/material';
import { ChevronDown } from 'react-feather';
import { ChannelConditionsDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { RestrictionType } from './models/restriction-type.enum';
import { ActionButtons } from '../ActionButtons';
import { TActionButtonsProps } from '../ActionButtons/ActionButtons';
import { useRestrictionsEffects } from './Restrictions.effects';
import { useStyles } from './Restrictions.styles';
import { RestrictionSelect } from './RestrictionSelect/RestrictionSelect';
import { DropdownFormList, TextField } from '@ddhub-client-gateway-frontend/ui/core';
import { ConnectionType } from "../Details/models/connection-type.enum";
import { includes } from 'lodash';

export interface RestrictionsProps {
  restrictions: ChannelConditionsDto;
  actionButtonsProps: TActionButtonsProps;
  connectionType: ConnectionType | string;
}

export const Restrictions = ({
  actionButtonsProps,
  restrictions,
  connectionType,
}: RestrictionsProps) => {
  const {
    type,
    setType,
    dids,
    roles,
    didInput,
    roleInput,
    isDIDValid,
    isRoleValid,
    removeRole,
    removeDID,
    handleClose,
    handleOpen,
    open,
    clear,
    handleSaveRestriction,
    handleUpdateRestriction,
    rolesInputChangeHandler,
    didInputChangeHandler,
    restrictionsCount,
    recent,
    handleOpenForm,
    handleCloseForm,
    toggleUpdate,
  } = useRestrictionsEffects(restrictions);
  const { classes } = useStyles();

  const selectRoleRestriction = type === RestrictionType.Role && (
    <TextField
      autoComplete='off'
      fullWidth
      variant={'outlined'}
      value={roleInput}
      placeholder='user.roles.namespace.ewc'
      onChange={(event) => {
        rolesInputChangeHandler(event.target.value);
      }}
      error={!isRoleValid}
      helperText={!isRoleValid ? 'Role format is invalid' : ''}
    />
  );

  const setDIDRestriction = type === RestrictionType.DID && (
    <TextField
      autoComplete='off'
      fullWidth
      variant={'outlined'}
      value={didInput}
      placeholder='did:ethr:volta:0x09Df...46993'
      onChange={(event) => {
        didInputChangeHandler(event.target.value);
      }}
      error={!isDIDValid}
      helperText={!isDIDValid ? 'DID format is invalid' : ''}
    />
  );

  const restrictionsTypes = Object.values(RestrictionType);
  const selectRestriction = restrictionsTypes.map((restrictionsType, index) => {
    return (
      <>
        {(restrictionsType === RestrictionType.Role ? roles : dids).map((el, index) => (
          <DropdownFormList
            toggleUpdate={toggleUpdate}
            index={index}
            value={el}
            key={index}
            remove={ restrictionsType === RestrictionType.Role ? removeRole : removeDID }
            canRemove={true}
            canCopy={false}
            handleOpenForm={handleOpenForm}
            recent={recent}
            list={ restrictionsType === RestrictionType.Role ? roles : dids}
            clear={clear}
            handleUpdateForm={handleUpdateRestriction}
            isDid={restrictionsType === RestrictionType.DID}
            type={restrictionsType}>
            <RestrictionSelect
              setType={setType}
              clear={clear}
              handleClose={handleCloseForm}
              handleSaveRestriction={handleSaveRestriction}
              handleUpdateRestriction={handleUpdateRestriction}
              roleInput={roleInput}
              isRoleValid={isRoleValid}
              didInput={didInput}
              isDIDValid={isDIDValid}
              selectedType={type}
              inputValue={el}>
              <>
                {selectRoleRestriction}
                {setDIDRestriction}
              </>
            </RestrictionSelect>
          </DropdownFormList>
          ))}
        </>
    );
  });

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      className={'no-wrap'}
      sx={{ height: '100%', flexWrap: 'nowrap' }}
    >
      <Grid item>
        <Grid container spacing={2} sx={{ paddingRight: '27px' }} direction="column">
          <Grid item sx={{ marginBottom: '22px' }} flexGrow="1">
            <InputLabel id="restriction-type" className={classes.label}>
              { includes([ConnectionType.Subscribe, 'sub'], connectionType) ? 'Senders' : 'Recipients' }
            </InputLabel>
            <Select
              labelId="restriction-type"
              value={type}
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              IconComponent={ChevronDown}
              classes={{
                icon: classes.icon,
              }}
              className={classes.select}
              sx={{ width: '100px' }}
              displayEmpty={true}
              renderValue={() => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  <Typography className={classes.selectValue} variant="body2">{open ? type : 'Add Restriction'}</Typography>
                </Box>
              )}
            >
              <RestrictionSelect
                setType={setType}
                clear={clear}
                handleClose={handleClose}
                handleSaveRestriction={handleSaveRestriction}
                roleInput={roleInput}
                isRoleValid={isRoleValid}
                didInput={didInput}
                isDIDValid={isDIDValid}>
                <>
                  {selectRoleRestriction}
                  {setDIDRestriction}
                </>
              </RestrictionSelect>
            </Select>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" pr={5.375}>
          <Typography className={classes.label}>
            {restrictionsCount} Restrictions
          </Typography>
          {/*<Typography className={classes.filterLabel}>*/}
          {/*  <Filter size={10}/> Filter*/}
          {/*</Typography>*/}
        </Box>
        <Box className={classes.restrictionBox}>
          {selectRestriction}
        </Box>
      </Grid>
      <Grid item alignSelf="flex-end" width="100%" sx={{ padding: '22px 7px 27px 0px' }}>
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
