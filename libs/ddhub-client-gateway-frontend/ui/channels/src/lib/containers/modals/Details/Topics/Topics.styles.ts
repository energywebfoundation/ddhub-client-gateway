import { makeStyles } from 'tss-react/mui';
import { lighten, alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  topic: {
    display: 'flex',
    cursor: 'pointer',
    padding: '4px 16px 7px 12px',
    justifyContent: 'space-between',
    '&:nth-of-type(even)': {
      background: lighten('#21273B', 0.1),
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
  },
  topicLabel: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  topicValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  topicsList: {
    maxHeight: 500,
    marginTop: 15,
    overflow: 'auto',
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
  },
}));
