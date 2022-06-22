import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    border: '1px solid',
    borderColor: '#384151',
    padding: '2px 0',
    background: '#21273B',
    fontSize: '12px',
    color: theme.palette.grey[300],
    height: '125px',
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
    '& .MuiGrid-root:nth-of-type(even)': {
      background: lighten('#21273B', 0.1),
    },
  },
  close: {
    padding: 0,
    width: 20,
    height: 20,
    '& svg': {
      stroke: theme.palette.secondary.main,
    },
  },
  container: {
    height: 24,
    padding: '0 3px 0 6px',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.grey[300],
    fontFamily: theme.typography.body2.fontFamily,
    maxWidth: 160,
  },
}));
