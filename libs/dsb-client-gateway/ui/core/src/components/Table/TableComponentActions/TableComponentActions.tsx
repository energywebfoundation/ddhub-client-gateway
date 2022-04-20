import { MoreVertical } from 'react-feather';
import { Menu, MenuItem, IconButton, TableCell } from '@mui/material';
import { useTableComponentActionsEffects } from './TableComponentActions.effects';
import { useStyles } from './TableComponentActions.styles';

export type TTableComponentAction<T = Record<string, unknown>> = {
  label: string;
  onClick?: (id: T) => void;
  color?: string;
};

interface TableComponentActionsProps<T> {
  data: T;
  actions: TTableComponentAction<T>[];
}

export function TableComponentActions<T>({
  data,
  actions,
}: TableComponentActionsProps<T>) {
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
                  action.onClick(data);
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
