import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  autocomplete: {
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
    '& .MuiOutlinedInput-input': {
      padding: '6px 10px 6px 15px',
      fontSize: 12,
      lineHeight: '24px',
      fontWeight: 400,
      letterSpacing: '0.4px',
      fontFamily: theme.typography.body2.fontFamily,
      '&::placeholder': {
        fontSize: 12,
        lineHeight: '24px',
        fontWeight: 400,
        color: theme.palette.common.white,
        opacity: 1,
      },
    },
    '& .MuiInputBase-input.MuiAutocomplete-input': {
      padding: '4px 10px 4px 0',
      minHeight: 22,
      fontFamily: theme.typography.body2.fontFamily,
      marginLeft: 3,
      '&.Mui-disabled': {
        WebkitTextFillColor: theme.palette.grey[500],
      },
    },
    '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
      fill: alpha(theme.palette.grey[100], 0.5),
    },
  },
  clearIndicator: {
    position: 'absolute',
    top: 0,
    right: 25,
  },
  popupIcon: {
    position: 'absolute',
    top: 2,
    right: 4,
    '& svg': {
      stroke: alpha(theme.palette.grey[100], 0.5),
    },
  },
  menuItem: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.text.primary,
    minHeight: 22,
    fontFamily: theme.typography.body2.fontFamily,
    padding: '8px 16px',
  },
  listBox: {
    maxHeight: 270,
    '&::-webkit-scrollbar': {
      width: 2,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',
      borderRadius: 3,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 3,
    },
  },
}));
