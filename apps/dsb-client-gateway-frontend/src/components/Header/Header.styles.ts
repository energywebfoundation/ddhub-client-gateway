import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    justifyContent: 'flex-end',
    padding: '11px 21px 12px',
    borderRadius: '6px',
    marginBottom: '24px',
    minHeight: 62,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  did: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.text.primary,
  },
  client: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  avatar: {
    width: '39px',
    height: '39px',
    borderRadius: '50%',
    background: lighten(theme.palette.primary.main, 0.4),
    marginLeft: '13px',
    position: 'relative',
  },
  status: {
    width: 11,
    height: 11,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  logoutButton: {
    marginLeft: 12,
  },
  logoutButtonIcon: {
    stroke: theme.palette.primary.main,
  },
}));
