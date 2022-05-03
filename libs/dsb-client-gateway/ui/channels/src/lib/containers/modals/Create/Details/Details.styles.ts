import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  form: {
    display: 'flex',
    height: '100%',
  },
  formContent: {
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  buttonContainer: {
    marginRight: '15px',
  },
}));
