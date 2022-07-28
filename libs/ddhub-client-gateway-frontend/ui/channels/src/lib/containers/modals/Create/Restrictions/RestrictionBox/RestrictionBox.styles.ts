import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderColor: '#384151',
    padding: '7px 5px 5px',
    minHeight: 204,
    maxHeight: 451,
    minWidth: 215,
  },
  label: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    margin: '0 0 5px 5px',
  },
}));
