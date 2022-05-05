import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  button: {
    height: 37,
    minWidth: 95,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
    '&.Mui-disabled .MuiButton-endIcon svg': {
      stroke: alpha(theme.palette.common.black, 0.26),
    },
  },
  buttonIcon: {
    marginLeft: 12,
    '& svg': {
      transition: theme.transitions.create('stroke', {
        duration: theme.transitions.duration.short,
      }),
    },
  },
}));
