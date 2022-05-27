import { Typography } from '@mui/material';
import { useStyles } from './EmptyTable.styles';

export const EmptyTable = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Typography className={classes.text} variant="body2">
        No items available for display
      </Typography>
    </div>
  );
};
