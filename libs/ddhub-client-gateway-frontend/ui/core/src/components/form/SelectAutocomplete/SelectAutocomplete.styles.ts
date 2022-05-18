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
      padding: '4px 0 4px 12px',
      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${theme.palette.grey[500]}`,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 5,
    },
    '& .MuiInputBase-input.MuiAutocomplete-input': {
      padding: '4px 10px 4px 0',
      minHeight: 22,
      fontFamily: theme.typography.body2.fontFamily,
      marginLeft: 3,
      '&.Mui-disabled': {
        WebkitTextFillColor: theme.palette.grey[500],
      },
      '&::placeholder': {
        fontSize: 12,
        lineHeight: '24px',
        fontWeight: 400,
        color: theme.palette.grey[300],
        opacity: 1,
      },
    },
    '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
      fill: alpha(theme.palette.grey[100], 0.5),
    },
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
    marginBottom: 10,
  },
  chip: {
    background: alpha(theme.palette.primary.main, 0.12),
    height: 20,
    margin: 3,
    '& .MuiChip-deleteIcon': {
      fontSize: 10,
      fill: theme.palette.common.white,
    },
  },
  chipLabel: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
