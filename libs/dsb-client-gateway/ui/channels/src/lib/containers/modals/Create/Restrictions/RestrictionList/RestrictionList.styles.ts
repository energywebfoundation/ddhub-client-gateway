import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    border: '1px solid',
    borderColor: '#384151',
    padding: 5,
    background: '#21273B',
    fontSize: '12px',
    color: theme.palette.grey[300],
    minHeight: '60px',
  },
  close: {
    '& .MuiSvgIcon-root': {
      color: theme.palette.secondary.main,
      width: '16px',
      height: '16px',
    },
  },
}));
