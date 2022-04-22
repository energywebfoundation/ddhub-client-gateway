import { makeStyles } from 'tss-react/mui';
import { alpha, lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiBackdrop-root': {
      transition: 'none !important'
    }
  },
  paper: {
    maxWidth: 514,
    minHeight: 620,
    padding: '37px 50px 52px 50px',
    borderRadius: 0
  },
  container: {
    transition: 'none !important'
  },
  appWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  appName: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
    margin: '15px 0 6px 0'
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
    fontFamily: theme.typography.body2.fontFamily,
    paddingBottom: 6,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18
  },
  actions: {
    padding: 0,
    marginTop: 10
  },
  appImage: {
    width: 66,
    height: 66
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    position: 'absolute'
  },
  details: {
    marginTop: 36,
    position: 'relative'
  },
  icon: {
    stroke: theme.palette.primary.main,
    width: 18,
    height: 18
  },
  editIconButton: {
    position: 'absolute',
    top: -10,
    right: 0
  },
  downloadIconButton: {
    position: 'absolute',
    top: -10,
    right: 30
  },
  detailsInfo: {
    marginTop: 15,
  },
  detailsInfoLabel: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    marginRight: 20
  },
  detailsInfoValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  tag: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.primary.main,
    padding: '1px 9px',
    margin: '2px 3px',
    borderRadius: 4,
    background: alpha(theme.palette.primary.main, 0.12),
  },
  schemaWrapper: {
    pointerEvents: 'none'
  }
}));
