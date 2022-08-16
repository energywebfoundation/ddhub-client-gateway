import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  appWrapper: {
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'start',
  },
  appName: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.h2.fontFamily,
    margin: '15px 0 6px 0',
  },
  namespace: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    textAlign: 'center',
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
  },
  appImage: {
    width: 48,
    height: 48,
  },
  label: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 1,
  },
}));
