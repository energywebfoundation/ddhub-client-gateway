import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  icon: {
    stroke: theme.palette.primary.main,
    width: 18,
    height: 18,
  },
}));
