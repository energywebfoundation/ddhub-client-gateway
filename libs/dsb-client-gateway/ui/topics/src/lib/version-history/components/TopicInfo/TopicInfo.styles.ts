import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    background: lighten(theme.palette.background.paper, 0.07),
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: theme.palette.common.white,
  },
  subTitle: {
    fontSize: 12,
  },
  row: {
    margin: '12px 0',
  },
}));
