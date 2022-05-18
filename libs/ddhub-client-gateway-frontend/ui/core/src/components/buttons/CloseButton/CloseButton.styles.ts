import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  closeIcon: {
    width: 20,
    height: 20,
    padding: 0,
    color: theme.palette.common.white,
  },
}));
