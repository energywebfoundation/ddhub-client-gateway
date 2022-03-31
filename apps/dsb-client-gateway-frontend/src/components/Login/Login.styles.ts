import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  highlight: {
    color: theme.palette.primary.main
  },
}));
