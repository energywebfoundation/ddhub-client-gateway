import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 860,
    minHeight: 600,
    padding: '48px 46px',
    borderRadius: 0,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18,
  },
  actions: {
    padding: 0,
    marginTop: 10,
  },
}));
