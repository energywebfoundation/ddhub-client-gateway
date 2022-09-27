import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  name: {
    fontSize: 12,
    lineHeight: '21px',
    fontFamily: `${theme.typography.h2.fontFamily} !important`,
    fontStyle: 'normal',
    maxWidth: 200,
    color: theme.palette.grey[300],
    fontWeight: 400,
  },
  count: {
    fontSize: 12,
    lineHeight: '18px',
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
  },
  select: {
    fontSize: 12,
    lineHeight: '14px',
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.text.secondary,
    padding: '23px 18px 15px 18px',
    fontWeight: 405,
  },
}));
