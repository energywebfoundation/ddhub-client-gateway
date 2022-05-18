import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  imageWrapper: {
    borderRadius: 6,
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
