import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiBackdrop-root': {
      transition: 'none !important',
    },
  },
  paper: {
    maxWidth: 514,
    minHeight: 641,
    padding: '55px 43px 48px 50px',
    borderRadius: 0,
  },
  container: {
    transition: 'none !important',
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
  imageWrapper: {
    width: 62,
    height: 58,
    borderRadius: 6,
    background: theme.palette.background.default,
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  detailsInfo: {
    marginTop: 15,
  },
  detailsInfoLabel: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    marginRight: 20,
  },
  detailsInfoValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
}));
