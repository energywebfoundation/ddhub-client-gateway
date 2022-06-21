import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  progress: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.common.white,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },
  button: {
    height: 37,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
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
  secondaryText: {
    '&.MuiTypography-root': {
      color: theme.palette.secondary.main,
    },
  },
  secondaryButton: {
    '&.MuiButton-root': {
      border: `1px solid ${theme.palette.secondary.main}`,
      '&:hover': {
        background: alpha(theme.palette.secondary.main, 0.04)
      },
    },
  },
}));
