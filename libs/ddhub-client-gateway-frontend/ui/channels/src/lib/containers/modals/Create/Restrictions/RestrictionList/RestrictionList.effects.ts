import { MouseEvent, useState } from 'react';
import { RestrictionType } from '../models/restriction-type.enum';

export interface RestrictionListEffectsProps {
  list: string[];
  remove?: (value: string) => void;
  type: RestrictionType;
  setType: (value: RestrictionType) => void;
  clear: () => void;
  handleUpdateRestriction: (value: string) => void;
  setRoleInput: (value: string) => void;
  setDIDInput: (value: string) => void;
}

export const useRestrictionListEffects = (
  {
    list,
    clear,
    setType,
    type,
    setDIDInput,
    setRoleInput,
    handleUpdateRestriction,
    remove,
  }: RestrictionListEffectsProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleClose = () => {
    setExpanded(false);
  };

  const handleOpen = (event: any) => {
    const selectId = event.currentTarget.id;
    const selectValue = list[selectId.replace('panel-', '')];

    clear();
    setExpanded(selectId);
    setType(type);

    if (type === RestrictionType.DID) {
      setDIDInput(selectValue);
    } else {
      setRoleInput(selectValue);
    }
  };

  const handleUpdate = (value: string) => {
    handleClose();
    handleUpdateRestriction(value);
  };

  const handleDelete = (event: MouseEvent<HTMLElement>, el: string) => {
    event.stopPropagation();

    if (remove) {
      remove(el);
    }
  };

  return {
    expanded,
    handleOpen,
    handleClose,
    handleUpdate,
    handleDelete,
  };
};
