import { useStyles } from './DropdownFormList.styles';
import { DropdownFormListEffectsProps, useDropdownFormListEffects } from './DropdownFormList.effects';
import { Select } from '@mui/material';
import clsx from 'clsx';
import { DropdownItem } from './DropdownItem';

export interface DropdownFormListProps extends DropdownFormListEffectsProps{
  canRemove: boolean;
  canCopy: boolean;
  children: React.ReactNode;
  recent: string;
  isDid?: boolean;
  index: number;
  value: string;
}

export const DropdownFormList = ({
  list,
  remove,
  canRemove,
  canCopy,
  clear,
  handleUpdateForm,
  handleOpenForm,
  children,
  recent,
  type,
  isDid,
  index,
  value,
  toggleUpdate,
}: DropdownFormListProps) => {
  const { classes } = useStyles();
  const {
    expanded,
    handleOpen,
    handleClose,
  } = useDropdownFormListEffects({
    list,
    clear,
    handleUpdateForm,
    handleOpenForm,
    remove,
    type,
    toggleUpdate,
  });

  const panelKey = `panel-${type ? type + '-' : ''}${index}`;

  return (
    <Select
      id={panelKey}
      key={panelKey}
      value={value}
      open={expanded === panelKey}
      onOpen={handleOpen}
      onClose={handleClose}
      IconComponent={() => null}
      classes={{
        icon: classes.icon,
      }}
      className={clsx(classes.select, {
        [classes.recent]: recent === value,
      })}
      sx={{ width: '100px' }}
      displayEmpty={true}
      renderValue={() => (
        <DropdownItem
          isDid={isDid}
          item={value}
          type={type}
          canRemove={canRemove}
          canCopy={canCopy}
          handleOpen={handleOpen}
          remove={remove}
          expanded={expanded}
          index={index} />
      )}>
      {children}
    </Select>
  );
};
