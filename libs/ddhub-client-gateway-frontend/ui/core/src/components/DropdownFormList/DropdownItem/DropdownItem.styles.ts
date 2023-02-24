import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  container: {
    alignItems: 'center',
  },
  gridItem: {
    display: 'flex',
    background: '#343559',
    borderRadius: 4,
    width: 45,
    height: 26,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 405,
    letterSpacing: '0.4px',
    color: theme.palette.grey[300],
    fontFamily: theme.typography.body2.fontFamily,
    alignSelf: 'center',
  },
  typeText: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 405,
    letterSpacing: '0.4px',
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.body2.fontFamily,
    alignSelf: 'center',
  },
  edit: {
    padding: 0,
    marginRight: 13,
    width: 20,
    height: 20,
    '& svg': {
      stroke: theme.palette.primary.main,
    },
  },
  editInactive: {
    '& svg': {
      stroke: theme.palette.grey[500],
    },
  },
  editActive: {
    '& svg': {
      stroke: theme.palette.text.secondary,
    },
  },
  close: {
    padding: 0,
    width: 20,
    height: 20,
    '& svg': {
      stroke: theme.palette.warning.main,
    },
  },
}));
