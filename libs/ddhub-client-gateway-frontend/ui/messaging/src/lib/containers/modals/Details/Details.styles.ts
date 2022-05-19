import { makeStyles } from 'tss-react/mui';
import { alpha, lighten, darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 514,
    minHeight: 500,
    padding: '37px 47px 35px 50px',
    borderRadius: 0,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  appName: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
    margin: '15px 0 6px 0',
  },
  topicName: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    textAlign: 'center',
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
  },
  detailsInfo: {
    marginTop: 17,
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
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
  },
  details: {
    marginTop: 36,
    position: 'relative',
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
  icon: {
    stroke: theme.palette.primary.main,
    width: 18,
    height: 18,
  },
  button: {
    height: 37,
    minWidth: 105,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
    '&.Mui-disabled': {
      '& .MuiTypography-root': {
        color: alpha(theme.palette.common.black, 0.26),
      },
    },
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },
}));
