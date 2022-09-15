import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  close: {
    padding: 0,
    width: 20,
    height: 20,
    '& svg': {
      stroke: theme.palette.warning.main,
    },
  },
  edit: {
    padding: 0,
    marginRight: 13,
    width: 20,
    height: 20,
    '& svg': {
      stroke: theme.palette.primary.main,
    },
  },
  editInactive: {
    '& svg': {
      stroke: theme.palette.grey[500],
    },
  },
  editActive: {
    '& svg': {
      stroke: theme.palette.text.secondary,
    },
  },
  container: {
    alignItems: 'center',
    background: '#21273B',
  },
  itemText: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.grey[300],
    fontFamily: theme.typography.body2.fontFamily,
    marginTop: 2,
  },
  gridItem: {
    display: 'flex',
    background: '#343559',
    borderRadius: 4,
    width: 45,
    height: 26,
   justifyContent: 'center',
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
  select: {
    marginBottom: 5,
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
      padding: '6px 10px 6px 7px !important',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 5,
    },
  },
}));
