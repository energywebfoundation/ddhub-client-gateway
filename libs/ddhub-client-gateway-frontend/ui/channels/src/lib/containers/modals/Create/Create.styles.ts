import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  content: {
    marginTop: 34,
    height: '100%',
    flexGrow: 1,
  },
  paper: {
    maxWidth: 757,
    minHeight: 510,
    padding: '37px 27px 27px 39px',
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
  formWrapper: {
    minWidth: '416px',
    marginLeft: 'auto',
    paddingTop: 16,
  },
  channelWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: -34,
  },
  type: {
    fontSize: 18,
    lineHeight: '22px',
    fontWeight: 500,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
    marginBottom: 13,
  },
  label: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 1,
  },
  value: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
    maxWidth: 224,
  },
  divider: {
    marginBottom: 27,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
  },
}));
