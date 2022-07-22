import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 860,
    minHeight: 693,
    padding: '48px 40px 40px 48px',
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
  icon: {
    stroke: theme.palette.primary.main,
    width: 16,
    height: 16,
  },
  downloadIconButton: {
    position: 'absolute',
    top: -10,
    right: 0,
  },
}));
