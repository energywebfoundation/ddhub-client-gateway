import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    border: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
    borderRadius: 3,
    padding: '7px 4px 7px 10px',
    width: 204,
    height: 159,
  },
  list: {
    overflow: 'auto',
    maxHeight: 118,
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
  label: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  text: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    maxWidth: 150,
  },
}));
