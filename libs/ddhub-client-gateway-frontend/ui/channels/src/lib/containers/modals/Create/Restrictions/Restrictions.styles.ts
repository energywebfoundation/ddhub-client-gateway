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
      width: '100%',
      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${theme.palette.grey[500]}`,
      },
    },
    '& .MuiSelect-select': {
      padding: '7px 10px 7px 15px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 5,
    },
    '& input': {
      padding: '7px 10px 7px 15px',
      fontFamily: theme.typography.body2.fontFamily,
    },
  },
  menuItem: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.text.primary,
    minHeight: 22,
    fontFamily: theme.typography.body2.fontFamily,
    padding: '9px 16px 10px',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: theme.palette.primary.main,
    },
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
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 10,
    lineHeight: '12px',
    fontWeight: 405,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
    cursor: 'pointer',
  },
  selectValue: {
    color: theme.palette.grey[300],
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 405,
  },
  restrictionBox: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 413,
    overflow: 'auto',
    paddingRight: '26px',
    fontSize: '12px',
    color: theme.palette.grey[300],
    flexGrow: 1,
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
    '& .MuiOutlinedInput-root.MuiInputBase-root:nth-of-type(even)': {
      background: '#32374A',
      '& .MuiGrid-root.MuiGrid-container': {
        background: '#32374A',
      },
      '& .MuiBox-root': {
        background: '#494A75',
      },
    },
  },
}));
