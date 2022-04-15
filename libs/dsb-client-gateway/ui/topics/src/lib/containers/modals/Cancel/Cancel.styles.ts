import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiBackdrop-root': {
      transition: 'none !important'
    }
  },
  paper: {
    maxWidth: 512,
    height: 300,
    padding: 43,
    alignItems: 'center',
    borderRadius: 6
  },
  container: {
    transition: 'none !important'
  },
  title: {
    fontSize: 21,
    lineHeight: '25px',
    fontWeight: 400,
    fontFamily: theme.typography.body1.fontFamily,
    color: theme.palette.common.white,
    padding: 0,
    marginBottom: 7,
    textAlign: 'center',
    marginTop: 18
  },
  subTitle: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    textAlign: 'center',
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
  },
  button: {
    padding: '10px 22px',
    margin: '0 10px',
    borderRadius: 5
  },
  cancelButtonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.primary.main,
    textTransform: 'capitalize'
  },
  submitButtonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    textTransform: 'capitalize'
  },
  actions: {
    padding: 0,
    marginTop: 26
  },
  icon: {
    stroke: theme.palette.warning.main
  }
}));
