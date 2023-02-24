import { useEffect, useState } from 'react';

export interface DropdownFormListEffectsProps {
  list: string[];
  remove?: (value: string) => void;
  clear: () => void;
  handleUpdateForm: (value: string) => void;
  handleOpenForm: (formValue: any) => void;
  type?: string;
  toggleUpdate: boolean;
}

export const useDropdownFormListEffects = (
  {
    list,
    clear,
    handleUpdateForm,
    handleOpenForm,
    type,
    toggleUpdate,
  }: DropdownFormListEffectsProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (expanded) {
      handleClose();
    }
  }, [toggleUpdate]);

  const handleClose = () => {
    setExpanded(false);
  };

  const handleOpen = (event: any) => {
    const selectId = event.currentTarget.id;
    let elementIndex = selectId.replace('panel-', '');

    if (type) {
      elementIndex = elementIndex.replace(`${type}-`, '');
    }

    const formValue = {
      selectValue: list[elementIndex],
      selectType: type,
    };

    clear();
    setExpanded(selectId);
    handleOpenForm(formValue);
  };

  const handleUpdate = (value: string) => {
    handleClose();
    handleUpdateForm(value);
  };

  return {
    expanded,
    handleOpen,
    handleClose,
    handleUpdate,
  };
}
