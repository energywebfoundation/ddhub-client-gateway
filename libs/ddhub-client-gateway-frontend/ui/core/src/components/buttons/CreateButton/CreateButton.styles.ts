import { makeStyles } from 'tss-react/mui';
import { darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
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
    margin: '0 0 18px auto',
  },
}));
