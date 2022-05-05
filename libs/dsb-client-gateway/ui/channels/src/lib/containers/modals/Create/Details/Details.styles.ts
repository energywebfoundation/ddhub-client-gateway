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
      paddingTop: 11,
    },
  },
});
