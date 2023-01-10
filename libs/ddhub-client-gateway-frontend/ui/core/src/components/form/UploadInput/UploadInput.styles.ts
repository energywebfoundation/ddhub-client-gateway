import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 13
  },
  button: {
    borderRadius: '0px 6px 6px 0px',
    padding: '7px 26px 7px 18px',
    minWidth: 84,
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
    '&.Mui-disabled': {
      '& .MuiTypography-root': {
        color: alpha(theme.palette.common.black, 0.26),
      },
    },
  },
  buttonText: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.common.white,
    textTransform: 'capitalize',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      '&.MuiInputBase-root': {
        paddingRight: 0,
      },
      '&.Mui-disabled': {
        '& .MuiOutlinedInput-notchedOutline': {
          border: `1px solid ${theme.palette.grey[500]}`,
          borderRadius: 5,
        },
      },
      '& input::placeholder': {
        color: theme.palette.grey[500],
        lineHeight: '24px',
      },
    },
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 405,
    lineHeight: '14.16px',
    color: theme.palette.common.white,
    alignSelf: 'center',
    '&#replace-message': {
      display: 'none',
    },
  },
  subtitleDisabled: {
    color: '#676D7D',
  },
  icon: {
    stroke: theme.palette.primary.main,
    strokeWidth: 1,
    width: 45,
    height: 45,
    alignSelf: 'center',
  },
  iconFile: {
    alignSelf: 'center',
  },
  iconInvalidFile: {
    stroke: theme.palette.error.main,
  },
  iconDisabled: {
    stroke: '#676D7D',
  },
}));
