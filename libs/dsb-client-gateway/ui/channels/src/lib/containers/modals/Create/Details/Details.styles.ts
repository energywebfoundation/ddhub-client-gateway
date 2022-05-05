import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()({
  form: {
    display: 'flex',
    height: '100%',
  },
  formContent: {
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
    '&.MuiGrid-item': {
      paddingTop: 8
    }
  },
  button: {
    height: 37,
    minWidth: 95,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'flex-start'
  },
  buttonIcon: {
    marginLeft: 12
  }
});
