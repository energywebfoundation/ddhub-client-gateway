import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    background: theme.palette.background.default,
    cursor: 'text',
    border: `1px solid ${theme.palette.grey[500]}`,
    boxSizing: 'border-box',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
  },
  placeholder: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    fontFamily: theme.typography.body2.fontFamily,
    position: 'absolute',
    top: 8,
    left: 15,
  },
}));
