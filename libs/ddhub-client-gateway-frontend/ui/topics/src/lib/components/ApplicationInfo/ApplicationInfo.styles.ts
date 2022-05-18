import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  appImage: {
    width: 49,
    height: 49,
    objectFit: 'cover',
  },
  label: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  value: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[400],
  },
}));
