import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  progress: {
    background: lighten(theme.palette.background.paper, 0.07),
    height: 46
  },
  skeleton: {
    transform: 'scale(1, 0.8)',
    height: 50
  }
}));
