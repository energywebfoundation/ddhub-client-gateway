import { alpha, darken } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 5,
    minHeight: 189,
    padding: '23px 21px 26px 21px',
  },
  label: {
    fontSize: 18,
    lineHeight: '22px',
    fontWeight: 500,
    color: theme.palette.text.primary,
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
}));
