import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    padding: '28px'
  },
  content: {
    flexGrow: 1
  },
}));
