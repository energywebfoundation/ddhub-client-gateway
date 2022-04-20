import { FC } from 'react';
import { MoreVertical } from 'react-feather';
import { Menu, MenuItem, IconButton, TableCell } from '@mui/material';
import { useTableComponentActionsEffects } from './TableComponentActions.effects';
import { useStyles } from './TableComponentActions.styles';

export type TTableComponentAction = {
  label: string;
  onClick?: (id: string) => void;
  color?: string;
};

interface TableComponentActionsProps {
  id: string;
  actions: TTableComponentAction[];
}

export const TableComponentActions: FC<TableComponentActionsProps> = ({
  id,
  actions,
}) => {
  const { classes } = useStyles();
  const { menuOpen, handleMenuOpen, handleClose, anchorRef } =
    useTableComponentActionsEffects();

  return (
    <TableCell>
      <IconButton onClick={handleMenuOpen} ref={anchorRef}>
        <MoreVertical className={classes.icon} />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorRef.current}
        open={menuOpen}
        onClose={handleClose}
        onClick={(event: React.MouseEvent<HTMLElement>) =>
          event.stopPropagation()
        }
        classes={{
          paper: classes.paper,
          list: classes.list,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {actions.map((action) => {
          return (
            <MenuItem
              key={action.label}
              style={{ color: action.color ?? 'inherit' }}
              className={classes.menuItem}
              onClick={() => {
                if (action.onClick) {
                  handleClose();
                  action.onClick(id);
                }
              }}
            >
              {action.label}
            </MenuItem>
          );
        })}
      </Menu>
    </TableCell>
  );
};
