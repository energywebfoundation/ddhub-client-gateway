import { useStyles } from './RestrictionList.styles';
import { Select } from '@mui/material';
import {
  RestrictionListEffectsProps,
  useRestrictionListEffects,
} from './RestrictionList.effects';
import { RestrictionSelect } from '../RestrictionSelect/RestrictionSelect';
import { RestrictionListView } from '../RestrictionListView/RestrictionListView';
import clsx from 'clsx';
import { RestrictionType } from '../models/restriction-type.enum';
import { useContext } from 'react';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';

export interface RestrictionListProps extends RestrictionListEffectsProps {
  canRemove: boolean;
  canCopy: boolean;
  handleSaveRestriction: () => void;
  roleInput: string;
  didInput: string;
  isRoleValid: boolean;
  isDIDValid: boolean;
  children: React.ReactNode;
  recent: string;
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
  recent,
  didRestrictionValues,
  setDIDRestrictionValue,
  setIsUpdate,
  setDidToUpdate,
}: RestrictionListProps) => {
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error(
      '[RestrictionList] AddressBookContext provider not available'
    );
  }
  const { classes } = useStyles();
  const { expanded, handleOpen, handleClose, handleUpdate } =
    useRestrictionListEffects({
      list,
      clear,
      setType,
      type,
      setDIDInput,
      setRoleInput,
      handleUpdateRestriction,
      remove,
      didRestrictionValues,
      setDIDRestrictionValue,
      setIsUpdate,
      setDidToUpdate,
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
          className={clsx(classes.select, {
            [classes.recent]: recent === el,
          })}
          sx={{ width: '100px' }}
          displayEmpty={true}
          renderValue={() => (
            <RestrictionListView
              item={el}
              type={type}
              didAlias={
                type === RestrictionType.DID
                  ? addressBookContext.getAlias(el, true)
                  : undefined
              }
              canRemove={canRemove}
              canCopy={canCopy}
              handleOpenUpdate={handleOpen}
              remove={remove}
              expanded={expanded}
              index={index}
            />
          )}
        >
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
            inputValue={el}
            didRestrictionValues={didRestrictionValues}
          >
            {children}
          </RestrictionSelect>
        </Select>
      ))}
    </>
  );
};
