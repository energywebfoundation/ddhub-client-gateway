import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 6,
    minHeight: 401,
    padding: '37px 23px 27px 25px',
  },
  channelWrapper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 6,
    minHeight: 133,
    marginTop: 36,
    padding: '46px 21px 28px 25px',
    marginBottom: 20,
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
}));
