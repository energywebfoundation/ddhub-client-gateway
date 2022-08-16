import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    padding: '4px 0 4px 8px',
    '&:nth-of-type(even)': {
      background: lighten('#21273B', 0.1),
    },
  },
  name: {
    color: theme.palette.common.white,
    fontSize: 14,
    lineHeight: '24px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
  },
  nameSecondary: {
    color: theme.palette.common.white,
    lineHeight: '21px',
  },
  owner: {
    color: theme.palette.grey[300],
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    marginTop: 1,
  },
  close: {
    width: 38,
    height: 38,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    '& svg': {
      stroke: theme.palette.secondary.main,
    },
  },
  copy: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
