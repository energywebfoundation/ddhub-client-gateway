import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiTableCell-root': {
      padding: '5px 12px',
    },
    '& .MuiTableRow-root:last-child > .MuiTableCell-root': {
      borderBottom: 'none',
    },
    '& .MuiTableCell-footer': {
      borderBottom: 'none',
      borderTop: '1px solid #384151'
    }
  },
  head: {
    background: lighten(theme.palette.background.paper, 0.07),
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.08em',
    color: theme.palette.grey[200],
    fontFamily: theme.typography.body2.fontFamily,
    height: 40,
  },
  body: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    padding: '14px 16px',
    color: theme.palette.grey[200],
    fontFamily: theme.typography.body2.fontFamily,
    height: 50,
  },
  spacer: {
    flex: 0,
  },
  displayedRows: {
    marginRight: 'auto',
  },
  action: {
    width: 30,
    color: 'transparent',
  },
  toolbar: {
    paddingLeft: 0,
  },
}));
