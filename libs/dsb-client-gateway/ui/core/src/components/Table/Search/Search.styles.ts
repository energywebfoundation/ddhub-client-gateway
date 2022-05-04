import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  root: {
    margin: '0 0 0 10px',
    background: alpha(theme.palette.background.default, 0.45),
    borderRadius: 5,
    width: 240,
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
  wrapper: {
    display: 'inline-flex',
    margin: '0 0 16px',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[600],
  },
  close: {
    color: theme.palette.common.white,
    cursor: 'pointer',
  },
}));
