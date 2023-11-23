import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  text: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 405,
    color: theme.palette.text.secondary,
    marginLeft: '5px',
  },
  box: {
    display: 'flex',
    backgroundColor: '#373C4E',
    borderRadius: '4px',
    padding: '1px 10px 1px 5px',
  },
  iconBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#28C76F33',
    borderRadius: '50%',
    minWidth: '16px',
    height: '16px',
  },
}));
