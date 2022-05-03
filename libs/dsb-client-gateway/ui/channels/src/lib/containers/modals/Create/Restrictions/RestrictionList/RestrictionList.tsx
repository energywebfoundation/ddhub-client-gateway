import { useStyles } from './RestrictionList.styles';
import { Close } from '@mui/icons-material';
import { Grid } from '@mui/material';
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
        <Grid container justifyContent="space-between" key={el}>
          <Grid item>{el}</Grid>
          {canRemove && (
            <Grid
              item
              onClick={() => {
                if (remove) {
                  remove(el);
                }
              }}
              className={classes.close}
            >
              <Close />
            </Grid>
          )}
          {canCopy && <CopyToClipboard text={el} />}
        </Grid>
      ))}
    </div>
  );
};
