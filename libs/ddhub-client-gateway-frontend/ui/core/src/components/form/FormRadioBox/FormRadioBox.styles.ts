import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
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
  subLabel: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 405,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
  },
  labelRoot: {
    '& .Mui-checked ~.MuiFormControlLabel-label': {
      color: theme.palette.common.white,
    },
  },
  optionBox: {
    border: `1px solid #404656`,
    borderRadius: 5,
    padding: '2px 11px 12px 11px',
  },
  circle: {
    borderRadius: '50%',
    fill: theme.palette.primary.main,
    boxShadow: `0px 2px 4px ${alpha(theme.palette.primary.dark, 0.4)}`,
  },
  checkedBg: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));
