import { makeStyles } from 'tss-react/mui';

const drawerWidth = 264;

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: '15px 14px 15px',
  },
}));
