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
    padding: '55px 43px 34px 50px',
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
    justifyContent: 'center',
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
  restrictionsBox: {
    border: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
    borderRadius: 3,
    padding: '7px 4px 7px 10px',
    width: 204,
    height: 159,
  },
  restictionsList: {
    overflow: 'auto',
    maxHeight: 118,
    '&::-webkit-scrollbar': {
      width: 2,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',
      borderRadius: 3,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 3,
    },
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  restrictionsBoxLabel: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  restrictionsItemtext: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    maxWidth: 150
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
    marginLeft: 38
  },
  divider: {
    marginTop: 22,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
  },
  topicLabel: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  topicValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  topicsList: {
    maxHeight: 90,
    marginTop: 15,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: 2,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',
      borderRadius: 3,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 3,
    },
  }
}));
