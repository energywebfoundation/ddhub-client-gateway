import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'Medium',
    fontSize: '24px',
    marginBottom: '1rem'
  },
  pageTitle: {
    marginRight: '1rem',
    fontSize: '24px'
  },
  breadCrumbs: {
    marginLeft: '1rem',
  },
  lastElement: {
    color: theme.palette.text.secondary
  },
  defaultElement: {
    color: theme.palette.primary.main
  }
}));
