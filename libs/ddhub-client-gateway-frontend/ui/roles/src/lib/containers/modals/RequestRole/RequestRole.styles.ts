import { makeStyles } from 'tss-react/mui';
import { alpha, darken, lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  content: {
    marginTop: 34,
    height: '100%',
    flexGrow: 1,
  },
  paper: {
    maxWidth: 860,
    minHeight: 693,
    maxHeight: 800,
    padding: '39px 20px 0px 39px',
    borderRadius: 0,
  },
  title: {
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 400,
    fontFamily: theme.typography.h2.fontFamily,
    color: theme.palette.common.white,
    marginBottom: 8,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18,
  },
  nextButtonWrapper: {
    position: 'absolute',
    bottom: 17,
    right: 18,
  },
  backButtonWrapper: {
    position: 'absolute',
    bottom: 17,
    left: 340,
  },
  formWrapper: {
    paddingTop: 16,
    flexGrow: 1,
    paddingLeft: 23,
    borderLeft: '1px solid #404656',
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
    alignSelf: 'center',
  },
  divider: {
    marginBottom: 27,
    marginTop: 18.4,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
  },
  encryptionValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
    marginLeft: 25,
  },
  iconCheck: {
    stroke: theme.palette.success.main,
    width: 21,
    height: 21,
    marginTop: 3,
  },
  iconX: {
    stroke: theme.palette.error.main,
    width: 21,
    height: 21,
    marginTop: 3,
  },
  updateFormWrapper: {
    paddingTop: 16,
    flexGrow: 1,
    paddingLeft: 63,
  },
  encryptionLabel: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 405,
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 12,
  },
  button: {
    height: 37,
    minWidth: 95,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
      boxShadow: `0px 0px 10px ${alpha(theme.palette.primary.main, 0.65)}`,
    },
    '&.Mui-disabled': {
      '& .MuiButton-endIcon svg': {
        stroke: alpha(theme.palette.common.black, 0.26),
      },
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
  buttonIcon: {
    margin: '1px 0 0 8px',
    '& svg': {
      transition: theme.transitions.create('stroke', {
        duration: theme.transitions.duration.short,
      }),
    },
  },
}));
