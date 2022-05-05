import { alpha } from '@mui/material';
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
        color: theme.palette.grey[300],
        opacity: 1,
      },
    },
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 10,
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
}));
