import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  highlight: {
    color: theme.palette.primary.main,
  },
  container: {
    padding: '0 42px',
  },
  mainLabel: {
    fontFamily: theme.typography.body1.fontFamily,
    fontWeight: 400,
    fontSize: '26px',
    lineHeight: '31px',
    paddingBottom: '6px'
  },
  submitBtn: {
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    textTransform: 'none',
    fontWeight: 400,
    letterSpacing: '0.4px'
  }
}));
