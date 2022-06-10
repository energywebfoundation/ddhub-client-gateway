import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  iconWrappper: {
    marginRight: 19,
  },
  label: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  name: {
    fontSize: 16,
    lineHeight: '23px',
    fontWeight: 400,
    fontFamily: theme.typography.body1.fontFamily,
    color: theme.palette.text.primary,
  },
  date: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.text.primary,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
