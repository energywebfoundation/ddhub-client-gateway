import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  name: {
    color: theme.palette.primary.main,
    fontSize: 14,
    fontFamily: theme.typography.body2.fontFamily,
  },
  owner: {
    color: theme.palette.grey[300],
  },
  close: {
    border: '1px solid',
    borderColor: theme.palette.warning.light,
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px',
    '& .MuiSvgIcon-root': {
      color: theme.palette.warning.light,
    },
  },
  copy: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
