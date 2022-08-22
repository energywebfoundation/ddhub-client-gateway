import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiBackdrop-root': {
      transition: 'none !important',
    },
  },
  paper: {
    maxWidth: 756,
    minHeight: 633,
    padding: '37px 43px 32px 32px',
    borderRadius: 6,
  },
  defaultPaper: {
    alignSelf: 'start',
    marginTop: 48,
  },
  container: {
    transition: 'none !important',
  },
}));
