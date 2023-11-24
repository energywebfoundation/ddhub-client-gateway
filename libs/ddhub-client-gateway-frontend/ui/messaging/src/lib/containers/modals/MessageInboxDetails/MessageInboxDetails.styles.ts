import { alpha, darken } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  content: {
    height: '100%',
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  contentWrapper: {
    paddingTop: 48,
    flexGrow: 1,
  },
  details: {
    position: 'relative',
  },
  appWrapper: {
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'start',
  },
  title: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.h2.fontFamily,
    margin: '15px 0 6px 0',
  },
  label: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 1,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    textAlign: 'center',
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
  },
  entryText: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 500,
    color: '#D0D2D6',
    fontFamily: theme.typography.body2.fontFamily,
  },
  tabHeaderWrapper: {
    padding: '0 12px',
  },
  tabContentWrapper: {
    maxHeight: '559px',
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
  },
  entryBox: {
    backgroundColor: '#262B3F',
    borderRadius: '6px',
    border: '1px #404656 solid',
  },
  accordion: {
    padding: 0,
    marginLeft: 8,
    width: 20,
    height: 20,
    '& svg': {
      stroke: theme.palette.text.secondary,
    },
  },
  actions: {
    padding: 0,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18,
  },
  button: {
    height: 37,
    minWidth: 95,
    textTransform: 'capitalize',
    padding: '11px 30px',
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
  center: {
    justifyContent: 'center',
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
