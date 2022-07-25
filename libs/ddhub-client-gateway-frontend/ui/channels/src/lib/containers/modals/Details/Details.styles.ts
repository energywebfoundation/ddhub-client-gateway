import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 860,
    minHeight: 693,
    padding: '48px 41px 34px 46px',
    borderRadius: 0,
  },
  content: {
    height: '100%',
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  channelWrapper: {
    display: 'flex',
    placeItems: 'start',
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
  value: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
    maxWidth: 224,
    alignSelf: 'center',
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
    position: 'relative',
  },
  icon: {
    stroke: theme.palette.primary.main,
    width: 16,
    height: 16,
  },
  editIconButton: {
    position: 'absolute',
    right: -20,
    top: 10,
  },
  label: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 1,
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
    marginBottom: 27,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
  },
  iconCheck: {
    stroke: theme.palette.success.main,
    width: 21,
    height: 21,
    strokeWidth: 1,
  },
  contentWrapper: {
    minWidth: '540px',
    paddingTop: 48,
    flexGrow: 1,
    paddingLeft: 63,
  },
}));
