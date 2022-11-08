import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  name: {
    fontSize: 12,
    lineHeight: '21px',
    fontFamily: theme.typography.body2.fontFamily,
    maxWidth: 135,
    color: theme.palette.text.secondary,
  },
  version: {
    fontSize: 10,
    lineHeight: '21px',
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.text.secondary,
  },
  tags: {
    '& .MuiChip-root': {
      cursor: 'pointer',
    },
  },
}));
