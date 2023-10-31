import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 514,
    minHeight: 466,
    padding: '37px 47px 35px 50px',
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
  title: {
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 500,
    fontFamily: theme.typography.body1.fontFamily,
    color: theme.palette.common.white,
  },
  label: {
    fontSize: 12,
    lineHeight: 'normal',
    fontWeight: 405,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    paddingBottom: 13,
  },
}));
