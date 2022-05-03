import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  root: {
    border: '1px solid',
    borderColor: '#384151',
    padding: 5,
    margin: '5px 0',
    maxHeight: '100px',
    height: '100%',
  },
}));
