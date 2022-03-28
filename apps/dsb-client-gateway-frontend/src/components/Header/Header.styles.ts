import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    justifyContent: 'flex-end',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '12px'
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  did: {
    fontSize: '14px'
  },
  client: {
    fontSize: '12px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: theme.palette.primary.main,
    marginLeft: '8px'
  }
}));
