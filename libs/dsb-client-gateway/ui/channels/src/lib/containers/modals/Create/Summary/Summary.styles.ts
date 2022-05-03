import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  detailsTitle: {
    fontSize: 12,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
    marginRight: 10,
  },
  description: {
    color: theme.palette.common.white,
    fontSize: 12,
    fontFamily: theme.typography.body2.fontFamily,
    marginRight: 10,
  },
  divider: {
    margin: '21px 0 16px 0',
  },
}));
