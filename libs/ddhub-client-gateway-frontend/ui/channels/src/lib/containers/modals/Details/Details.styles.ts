import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 600,
    minHeight: 800,
    padding: '55px 43px 34px 50px',
    borderRadius: 0,
  },
  channelWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  type: {
    fontSize: 18,
    lineHeight: '25px',
    fontWeight: 500,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
    marginBottom: 6,
  },
  namespace: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    textAlign: 'center',
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
  },
  title: {
    fontSize: 18,
    lineHeight: '22px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
    paddingBottom: 6,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
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
  details: {
    marginTop: 36,
    position: 'relative',
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
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  typeWrapper: {
    margin: '17px 0 16px',
    paddingBottom: 19,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
  },
  typeLabel: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  typeValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
    marginLeft: 38,
  },
  encryptionValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
    marginLeft: 25,
  },
  divider: {
    marginTop: 22,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
  },
  iconCheck: {
    stroke: theme.palette.success.main,
    width: 21,
    height: 21,
  },
}));
