import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  button: {
    height: 37,
    minWidth: 77,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
