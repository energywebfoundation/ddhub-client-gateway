import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  select: {
    margin: 0,
    background: alpha(theme.palette.background.default, 0.45),
    borderRadius: 5,
    '&.MuiInputBase-root': {
      fontFamily: theme.typography.body2.fontFamily,
      fontSize: 12,
      lineHeight: '24px',
      fontWeight: 400,
      color: theme.palette.common.white,
      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${theme.palette.grey[500]}`,
      }
    },
    '& .MuiSelect-select': {
      padding: '7px 10px 7px 15px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 5
    },
    '& input': {
      padding: '7px 10px 7px 15px',
      fontFamily: theme.typography.body2.fontFamily
    },
  },
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
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 5
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
        opacity: 1
      },
    },
    '& .MuiInputBase-input.MuiAutocomplete-input': {
      padding: '4px 10px 4px 0',
      minHeight: 22,
      fontFamily: theme.typography.body2.fontFamily,
      marginLeft: 3,
      '&.Mui-disabled': {
        WebkitTextFillColor: theme.palette.grey[500],
      }
    },
    '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
      fill: alpha(theme.palette.grey[100], 0.5)
    }
  },
  textField: {
    margin: 0,
    background: alpha(theme.palette.background.default, 0.45),
    borderRadius: 5,
    '& .MuiInputBase-root': {
      fontFamily: theme.typography.body2.fontFamily,
      fontSize: 12,
      lineHeight: '24px',
      fontWeight: 400,
    },
    '& .MuiFormHelperText-root': {
       position: 'absolute',
       bottom: -22
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
  menuItem: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.text.primary,
    minHeight: 22,
    fontFamily: theme.typography.body2.fontFamily,
    padding: '8px 16px'
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
    transform: 'none',
    '& svg': {
      stroke: theme.palette.common.white
    }
  },
  icon: {
    top: 8,
    right: 13,
    stroke: alpha(theme.palette.grey[100], 0.5),
    width: 20,
    '&.Mui-disabled': {
      stroke: theme.palette.grey[500],
    },
  },
  plusButton: {
    position: 'absolute',
    right: 3,
    top: 5,
    padding: 0
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 8,
  },
}));
