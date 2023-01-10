import { makeStyles } from 'tss-react/mui';
import { darken, alpha } from '@mui/material/styles';

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
      boxShadow: `0px 0px 10px ${alpha(theme.palette.primary.main, 0.65)}`,
    },
  },
  secondaryButton: {
    height: 37,
    minWidth: 75,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'center',
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
    marginRight: 17.5,
    '&:hover': {
      border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
      background: alpha(theme.palette.secondary.main, 0.04),
    },
    color: theme.palette.secondary.main,
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
  },
  secondaryButtonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.secondary.main,
    fontFamily: theme.typography.body2.fontFamily,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },
}));
