import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.default,
    borderRadius: 6,
    width: 42,
    height: 42,
    margin: '5px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    objectFit: 'cover',
    width: 23,
    height: 23,
  }
}));
