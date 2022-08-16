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
    width: 14,
    height: 14,
  },
  editIconButton: {
    position: 'absolute',
    top: 10,
    right: 0,
  },
  downloadIconButton: {
    position: 'absolute',
    top: 10,
    right: 30,
  },
}));
