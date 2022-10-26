import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  icon: {
    border: 'none',
    margin: '43px auto 0',
    '& svg': {
      width: '80px',
      height: '80px',
    },
  },
  successIcon: {
    stroke: theme.palette.success.main,
    width: 67,
    height: 67,
  },
  title: {
    paddingTop: 18,
  },
  popup: {
    paddingBottom: 43,
    animation: 'none',
    borderRadius: 6,
  },
  actionsContainer: {
    paddingTop: 19,
  },
  actions: {
    '&.swal2-confirm': {
      transition: theme.transitions.create(
        ['color', 'background-color', 'border-color', 'box-shadow'],
        {
          duration: theme.transitions.duration.short,
        }
      ),
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
    '&.swal2-cancel, &.swal2-confirm': {
      margin: '0 10px',
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 400,
      letterSpacing: '0.4px',
      fontFamily: theme.typography.body2.fontFamily,
      borderRadius: 5,
      padding: '9px 22px',
      '&:focus': {
        boxShadow: 'none',
      },
    },
  },
  container: {
    transition: 'none',
    '&.swal2-backdrop-show': {
      background: alpha(theme.palette.common.black, 0.5),
    },
  },
}));
