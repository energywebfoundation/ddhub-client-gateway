import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  content: {
    marginTop: 34,
    height: '100%',
    flexGrow: 1
  },
  paper: {
    maxWidth: 757,
    minHeight: 510,
    padding: '37px 27px 27px 39px',
    borderRadius: 0
  },
  title: {
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 500,
    fontFamily: theme.typography.body1.fontFamily,
    color: theme.palette.common.white
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18
  },
  formWrapper: {
    minWidth: '416px',
    marginLeft: 'auto',
    paddingTop: 16
  }
}));
