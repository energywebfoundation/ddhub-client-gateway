import { Box, BoxProps, Grid, IconButton, Typography } from '@mui/material';
import { useStyles } from './DropdownItem.styles';
import clsx from 'clsx';
import { Edit3, X as Close } from 'react-feather';
import { MouseEvent } from 'react';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';

export interface DropdownItemProps {
  item: string;
  canRemove?: boolean;
  canCopy?: boolean;
  isDid?: boolean;
  handleOpen?: (event: any) => void;
  remove?: (value: string) => void;
  expanded?: string | boolean;
  type?: string;
  index: number;
  wrapperProps?: BoxProps;
}

export const DropdownItem = (
  {
    item,
    type,
    canRemove = false,
    canCopy = false,
    isDid = false,
    handleOpen,
    remove,
    expanded,
    index,
    wrapperProps,
  }: DropdownItemProps) => {
  const { classes } = useStyles();
  const panelKey = `panel-${type ? type + '-' : ''}${index}`;

  let formattedItem = item;

  if (isDid) {
    formattedItem = didFormatMinifier(item);
  } else if (item.length > 30) {
    formattedItem = `${item.substring(0, 19)}...${item.substring(item.length - 5)}`;
  }

  return (
    <Box {...wrapperProps}>
      <Grid
        container
        justifyContent="space-between"
        key={item}
        className={classes.container}>
        <Grid item display="flex" flexDirection="row">
          { type && (
            <Box className={classes.gridItem}>
              <Typography variant="body2" className={classes.typeText}>{ type }</Typography>
            </Box>
          )}
          <Typography noWrap variant="body2" className={classes.itemText} pl='14px'>
            {formattedItem}
          </Typography>
        </Grid>
        {canRemove && (
          <Grid item display="flex" flexDirection="row">
            <IconButton
              onClick={handleOpen}
              className={clsx(classes.edit, {
                [classes.editActive]: (expanded && expanded === panelKey),
                [classes.editInactive]: (expanded && expanded !== panelKey),
              })}>
              <Edit3 size={18} />
            </IconButton>
            <IconButton
              onMouseDown={(event: MouseEvent<HTMLElement>) => {
                event.stopPropagation();

                if (remove) {
                  remove(item);
                }
              }}
              className={classes.close}>
              <Close size={18} />
            </IconButton>
          </Grid>
        )}
        {canCopy && <CopyToClipboard text={item} />}
      </Grid>
    </Box>
  );
};

