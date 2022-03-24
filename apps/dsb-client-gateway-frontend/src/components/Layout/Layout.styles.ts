import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1
  },
}));
