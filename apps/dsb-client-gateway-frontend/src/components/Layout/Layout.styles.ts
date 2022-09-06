import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    padding: '15px 28px 28px',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  content: {
    flexGrow: 1
  },
  childContent: {
    maxWidth: 1440,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));
