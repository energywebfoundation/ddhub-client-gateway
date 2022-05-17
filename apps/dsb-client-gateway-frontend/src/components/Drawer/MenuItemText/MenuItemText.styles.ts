import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  listItemText: {
    fontSize: 15,
    lineHeight: '24px',
    fontWeight: 500,
    color: theme.palette.grey[200],
  },
}));
