import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  detailsTitle: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
    marginRight: 26,
  },
  description: {
    color: theme.palette.common.white,
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily
  },
  divider: {
    margin: '21px 0 16px 0',
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
    marginBottom: 16
  },
  mainLabel: {
    fontSize: 18,
    lineHeight: '21px',
    fontWeight: 500,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
  }
}));
