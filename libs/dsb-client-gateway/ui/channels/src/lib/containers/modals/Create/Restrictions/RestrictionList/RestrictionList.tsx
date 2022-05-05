import { useStyles } from './RestrictionList.styles';
import { X as Close } from 'react-feather';
import { Grid, Typography, IconButton } from '@mui/material';
import { CopyToClipboard } from '@dsb-client-gateway/ui/core';

export interface RestrictionListProps {
  list: string[];
  canRemove: boolean;
  canCopy: boolean;
  remove?: (value: string) => void;
}

export const RestrictionList = ({
  list,
  remove,
  canRemove,
  canCopy,
}: RestrictionListProps) => {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      {list.map((el) => (
        <Grid
          container
          justifyContent="space-between"
          key={el}
          className={classes.container}
        >
          <Grid item>
            <Typography noWrap variant="body2" className={classes.itemText}>
              {el}
            </Typography>
          </Grid>
          {canRemove && (
            <IconButton
              onClick={() => {
                if (remove) {
                  remove(el);
                }
              }}
              className={classes.close}
            >
              <Close size={18} />
            </IconButton>
          )}
          {canCopy && <CopyToClipboard text={el} />}
        </Grid>
      ))}
    </div>
  );
};
