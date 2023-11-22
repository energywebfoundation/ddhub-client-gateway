import { Box, BoxProps, Grid, IconButton, Typography } from '@mui/material';
import { RestrictionType } from '../models/restriction-type.enum';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import clsx from "clsx";
import { Edit3, X as Close } from 'react-feather';
import { MouseEvent } from 'react';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './RestrictionListView.styles';

interface RestrictionListViewProps {
  item: string;
  type?: RestrictionType;
  canRemove?: boolean;
  canCopy?: boolean;
  handleOpen?: (event: any) => void;
  remove?: (value: string) => void;
  expanded?: string | boolean;
  index: number;
  wrapperProps?: BoxProps;
}

export const RestrictionListView = (
  {
    item,
    type,
    canRemove = false,
    canCopy = false,
    handleOpen,
    remove,
    expanded,
    index,
    wrapperProps,
  }: RestrictionListViewProps) => {
  const { classes } = useStyles();

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
            {type === RestrictionType.DID && (
              <Box className={classes.gridItem}>
                <Typography variant="body2" className={classes.typeText}>{ 'KIM' }</Typography>
              </Box>
            )}
          )}
          <Typography noWrap variant="body2" className={classes.itemText} pl='14px'>
            {type === RestrictionType.DID ? didFormatMinifier(item) : item}
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
}
