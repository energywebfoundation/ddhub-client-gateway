import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    border: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
    borderRadius: 3,
    padding: '12px 0 12px 0',
    width: 245,
    minHeight: 159,
  },
  list: {
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
    '& .MuiBox-root:nth-of-type(even)': {
      background: '#32394F',
    },
  },
  label: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    padding: '0 14px 0 14px',
  },
  text: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    maxWidth: 150,
    alignSelf: 'center',
  },
}));
