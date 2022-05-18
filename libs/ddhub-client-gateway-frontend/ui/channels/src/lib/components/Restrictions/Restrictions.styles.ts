import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  text: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.grey[200],
  },
}));
