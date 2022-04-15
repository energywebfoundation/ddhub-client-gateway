import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
   root: {},
   head: {
     background: lighten(theme.palette.background.paper, 0.07),
     fontSize: 12,
     lineHeight: '14px',
     fontWeight: 400,
     letterSpacing: '0.08em',
     color: theme.palette.grey[200],
     fontFamily: theme.typography.body2.fontFamily,
   },
   body: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    padding: '14px 16px',
    color: theme.palette.grey[200],
    fontFamily: theme.typography.body2.fontFamily,
   },
   spacer: {
     flex: 0
   },
   displayedRows: {
     marginRight: 'auto'
   }
}));
