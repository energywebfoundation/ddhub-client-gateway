import { darken } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    padding: '39px 22px 23px 30px',
    minHeight: 212,
    borderRadius: 6,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column'
  },
  iconWrapper: {
    width: 46,
    height: 46,
    margin: '7px 23px 0 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.text.primary
  },
  label: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    marginRight: 7,
  },
  value: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.grey[300]
  },
  subtitle: {
    fontSize: 10,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.text.primary,
    margin: '7px 0 0 10px'
  },
  footer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'flex-end'
  },
  button: {
    height: 37,
    minWidth: 75,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  }
}));
