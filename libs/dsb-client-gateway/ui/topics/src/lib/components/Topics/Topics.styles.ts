import { makeStyles } from 'tss-react/mui';
import { darken, alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  table: {
    marginTop: 16,
  },
  createTopicButton: {
    padding: '10px 30px',
    justifyContent: 'flex-end',
    color: theme.palette.common.white,
    borderRadius: 5,
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
  },
  createTopicButtonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    textTransform: 'capitalize',
  },
  createTopicButtonWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    margin: '0 0 18px auto'
  },
  list: {
    borderRadius: 6,
    background: theme.palette.background.paper
  },
  menuItem: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    padding: '8px 16px 8px 20px',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.body2.fontFamily,
   '&:hover': {
     backgroundColor: theme.palette.primary.dark
   }
  },
  paper: {
    width: 196,
    borderRadius: 6,
    background: theme.palette.background.paper,
    boxShadow: `0px 5px 25px ${alpha(theme.palette.common.black, 0.1)}`
  },
}));
