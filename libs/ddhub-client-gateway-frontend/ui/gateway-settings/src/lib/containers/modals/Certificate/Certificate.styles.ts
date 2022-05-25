import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 510,
    minHeight: 541,
    padding: '37px 51px 33px 58px',
    borderRadius: 0,
  },
  title: {
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 500,
    fontFamily: theme.typography.body1.fontFamily,
    color: theme.palette.common.white,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18,
  },
}));
