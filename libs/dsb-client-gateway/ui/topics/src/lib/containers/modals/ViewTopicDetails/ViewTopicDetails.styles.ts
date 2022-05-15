import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 514,
    minHeight: 620,
    padding: '37px 50px 52px 50px',
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
    width: 18,
    height: 18,
  },
  editIconButton: {
    position: 'absolute',
    top: -10,
    right: 0,
  },
  downloadIconButton: {
    position: 'absolute',
    top: -10,
    right: 30,
  },
}));
