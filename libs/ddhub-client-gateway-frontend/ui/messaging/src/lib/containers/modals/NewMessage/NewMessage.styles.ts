import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 860,
    minHeight: 693,
    padding: '51px 46px 35px 49px',
    borderRadius: 0,
  },
  content: {
    height: '100%',
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  contentWrapper: {
    // paddingTop: 48,
    flexGrow: 1,
  },
  infoWrapper: {
    display: 'flex',
    placeItems: 'start',
    flexDirection: 'column',
  },
  title: {
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 400,
    fontFamily: theme.typography.h2.fontFamily,
    color: theme.palette.common.white,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 500,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
  },
  label: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
    marginRight: 12,
    fontFamily: theme.typography.body2.fontFamily,
  },
  value: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
    alignSelf: 'center',
  },
  valueSuccess: {
    color: `${theme.palette.success.main} !important`,
  },
  valueFailed: {
    color: `${theme.palette.error.main} !important`,
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
  divider: {
    marginBottom: 27,
    marginTop: 18.4,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
  },
}));
