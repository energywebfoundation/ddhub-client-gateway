import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  button: {
    height: 37,
    minWidth: 95,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
      boxShadow: `0px 0px 10px ${alpha(theme.palette.primary.main, 0.65)}`,
    },
    '&.Mui-disabled': {
      '& .MuiButton-endIcon svg': {
        stroke: alpha(theme.palette.common.black, 0.26),
      },
      '& .MuiTypography-root': {
        color: alpha(theme.palette.common.black, 0.26),
      },
    },
  },
  center: {
    justifyContent: 'center',
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
  buttonIcon: {
    margin: '1px 0 0 8px',
    '& svg': {
      transition: theme.transitions.create('stroke', {
        duration: theme.transitions.duration.short,
      }),
    },
  },
}));
