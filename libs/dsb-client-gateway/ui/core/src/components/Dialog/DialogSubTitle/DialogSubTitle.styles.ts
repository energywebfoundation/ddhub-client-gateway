import { makeStyles } from 'tss-react/mui';
import { alpha, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  subTitle: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    textAlign: 'center',
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
  }
}));
