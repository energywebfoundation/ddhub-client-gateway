import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
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
      border: '1px solid #404656',
      borderRadius: 5,
    },
  },
  recent: {
    border: `1px solid ${theme.palette.common.white}`,
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
    },
  },
}));
