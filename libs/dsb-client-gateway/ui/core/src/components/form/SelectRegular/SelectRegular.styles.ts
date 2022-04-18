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
    '& .MuiSelect-select': {
      padding: '8px 10px 8px 15px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 5
    },
    '& input': {
      padding: '8px 10px 8px 15px',
      fontFamily: theme.typography.body2.fontFamily
    }
  },
  placeholder: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    fontFamily: theme.typography.body2.fontFamily,
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 10
  },
  menuItem: {
    fontSize: 12,
    color: theme.palette.common.white,
    minHeight: 22,
    fontFamily: theme.typography.body2.fontFamily,
  },
  icon: {
    top: 9,
    right: 15,
    stroke: alpha(theme.palette.grey[200], 0.5),
    width: 20
  }
}));
