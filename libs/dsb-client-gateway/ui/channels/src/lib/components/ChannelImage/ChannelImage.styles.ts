import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  imageWrapper: {
    width: 62,
    height: 58,
    borderRadius: 6,
    background: theme.palette.background.default,
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
