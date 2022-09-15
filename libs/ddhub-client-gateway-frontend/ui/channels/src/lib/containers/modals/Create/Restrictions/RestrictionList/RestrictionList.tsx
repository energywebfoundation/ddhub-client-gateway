import { MouseEvent, useState } from 'react';
import { useStyles } from './RestrictionList.styles';
import { Edit3, X as Close } from 'react-feather';
import { Box, Grid, IconButton, Select, Typography } from '@mui/material';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { RestrictionType } from '../models/restriction-type.enum';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { RestrictionListEffectsProps, useRestrictionListEffects } from './RestrictionList.effects';
import { RestrictionSelect } from "../RestrictionSelect/RestrictionSelect";
import clsx from 'clsx';

export interface RestrictionListProps extends RestrictionListEffectsProps {
  canRemove: boolean;
  canCopy: boolean;
  handleSaveRestriction: () => void;
  roleInput: string;
  didInput: string;
  isRoleValid: boolean;
  isDIDValid: boolean;
  children: React.ReactNode;
}

export const RestrictionList = ({
  list,
  remove,
  canRemove,
  canCopy,
  type,
  setType,
  clear,
  handleSaveRestriction,
  handleUpdateRestriction,
  roleInput,
  isRoleValid,
  didInput,
  isDIDValid,
  children,
  setRoleInput,
  setDIDInput,
}: RestrictionListProps) => {
  const { classes } = useStyles();
  const {
    expanded,
    handleOpen,
    handleClose,
    handleUpdate,
    handleDelete,
  } = useRestrictionListEffects({
    list,
    clear,
    setType,
    type,
    setDIDInput,
    setRoleInput,
    handleUpdateRestriction,
    remove,
  });

  return (
    <>
      {list.map((el, index) => (
        <Select
          id={`panel-${index}`}
          key={`panel-${index}`}
          value={el}
          open={expanded === `panel-${index}`}
          onOpen={handleOpen}
          onClose={handleClose}
          IconComponent={() => null}
          classes={{
            icon: classes.icon,
          }}
          className={classes.select}
          sx={{ width: '100px' }}
          displayEmpty={true}
          renderValue={() => (
            <Grid
              container
              justifyContent="space-between"
              key={el}
              className={classes.container}>
              <Grid item display="flex" flexDirection="row">
                <Box className={classes.gridItem}>
                  <Typography variant="body2" className={classes.itemText}>{ type }</Typography>
                </Box>
                <Typography noWrap variant="body2" className={classes.itemText} pl='14px'>
                  {type === RestrictionType.DID ? didFormatMinifier(el) : el}
                </Typography>
              </Grid>
              {canRemove && (
              <Grid item display="flex" flexDirection="row">
                <IconButton
                  onClick={handleOpen}
                  className={clsx(classes.edit, {
                    [classes.editActive]: (expanded && expanded === `panel-${index}`),
                    [classes.editInactive]: (expanded && expanded !== `panel-${index}`),
                  })}>
                  <Edit3 size={18} />
                </IconButton>
                <IconButton
                  onMouseDown={(event: MouseEvent<HTMLElement>) => {
                    handleDelete(event, el);
                  }}
                  className={classes.close}>
                  <Close size={18} />
                </IconButton>
              </Grid>
              )}
            {canCopy && <CopyToClipboard text={el} />}
              </Grid>
            )}>
              <RestrictionSelect
                setType={setType}
                clear={clear}
                handleClose={handleClose}
                handleSaveRestriction={handleSaveRestriction}
                handleUpdateRestriction={handleUpdate}
                roleInput={roleInput}
                isRoleValid={isRoleValid}
                didInput={didInput}
                isDIDValid={isDIDValid}
                selectedType={type}
                inputValue={el}>
                {children}
              </RestrictionSelect>
        </Select>
      ))}
    </>
  );
};
