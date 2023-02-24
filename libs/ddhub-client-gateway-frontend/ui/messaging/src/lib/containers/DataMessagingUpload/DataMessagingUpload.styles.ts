import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 6,
  },
  uploadWrapper: {
    width: 466,
    minWidth: 466,
    height: 317,
    padding: '53px 23px 27px 71px',
    flexGrow: 1,
  },
  channelWrapper: {
    marginTop: 47,
    padding: '0px 70px 0px 25px',
    minHeight: '440px',
  },
  field: {
    '& .MuiOutlinedInput-root input::placeholder': {
      color: theme.palette.grey[500],
    },
  },
  button: {
    height: 37,
    minWidth: 75,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
      boxShadow: `0px 0px 10px ${alpha(theme.palette.primary.main, 0.65)}`,
    },
    '&.Mui-disabled': {
      '& .MuiTypography-root': {
        color: alpha(theme.palette.common.black, 0.26),
      },
    },
  },
  center: {
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
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
  icon: {
    top: 8,
    right: 13,
    stroke: theme.palette.common.white,
    width: 20,
    '&.Mui-disabled': {
      stroke: theme.palette.grey[500],
    },
  },
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
  selectValue: {
    color: theme.palette.grey[500],
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 405,
  },
  recipientsBox: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 220,
    overflow: 'auto',
    paddingRight: '2px',
    fontSize: '12px',
    color: theme.palette.grey[300],
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
