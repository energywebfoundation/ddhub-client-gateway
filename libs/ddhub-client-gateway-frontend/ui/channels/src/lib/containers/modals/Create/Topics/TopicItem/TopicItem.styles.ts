import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  name: {
    fontSize: 14,
    lineHeight: '21px',
    fontFamily: theme.typography.body2.fontFamily,
    maxWidth: 135,
  },
  version: {
    fontSize: 10,
    lineHeight: '21px',
    fontFamily: theme.typography.body2.fontFamily,
  },
  tags: {
    '& .MuiChip-root': {
      cursor: 'pointer',
    },
  },
}));
