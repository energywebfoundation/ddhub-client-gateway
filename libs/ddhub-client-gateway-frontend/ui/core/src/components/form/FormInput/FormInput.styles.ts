import { alpha, darken } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    margin: 0,
    background: alpha(theme.palette.background.default, 0.45),
    borderRadius: 5,
    '& .MuiInputBase-root': {
      fontFamily: theme.typography.body2.fontFamily,
      fontSize: 12,
      lineHeight: '24px',
      fontWeight: 400,
      paddingRight: 4,
    },
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      bottom: -22,
      fontSize: 12,
      lineHeight: '17px',
      fontWeight: 400,
      color: theme.palette.error.main,
      fontFamily: theme.typography.body2.fontFamily,
      letterSpacing: '0.4px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 5,
    },
    '& input': {
      padding: '8px 10px 8px 15px',
      fontSize: 12,
      color: theme.palette.common.white,
      minHeight: 22,
      fontFamily: theme.typography.body2.fontFamily,
      '&:disabled': {
        color: theme.palette.grey[500],
        WebkitTextFillColor: theme.palette.grey[500],
        '& + .MuiOutlinedInput-notchedOutline': {
          border: `1px solid ${theme.palette.grey[500]}`,
        },
      },
      '&::placeholder': {
        fontSize: 12,
        lineHeight: '24px',
        fontWeight: 400,
        letterSpacing: '0.4px',
        fontFamily: theme.typography.body2.fontFamily,
        color: theme.palette.grey[300],
        opacity: 1,
      },
    },
  },
  label: {
    position: 'relative',
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 10,
    transform: 'unset',
    '&.Mui-focused': {
      color: theme.palette.common.white,
    },
  },
  checkboxLabel: {
    position: 'relative',
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 0,
    transform: 'unset',
    '&.Mui-focused': {
      color: theme.palette.common.white,
    },
  },
  formControlLabel: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
    letterSpacing: '0.4px',
  },
  labelRoot: {
    '& .Mui-checked ~.MuiFormControlLabel-label': {
      color: theme.palette.common.white,
    },
  },
  circle: {
    borderRadius: '50%',
    fill: theme.palette.primary.main,
    boxShadow: `0px 2px 4px ${alpha(theme.palette.primary.dark, 0.4)}`,
  },
  listLabel: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    margin: '10px 0',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    margin: '7px 0 10px',
    color: theme.palette.text.primary,
  },
  button: {
    height: 37,
    minWidth: 95,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'center',
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
  buttonText: {
    fontSize: 12,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.h2.fontFamily,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },
  buttonIcon: {
    margin: '1px 0 0 8px',
    fontSize: 22,
    color: theme.palette.primary.main,
    '& svg': {
      transition: theme.transitions.create('stroke', {
        duration: theme.transitions.duration.short,
      }),
    },
  },
}));
