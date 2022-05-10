import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 6,
    minHeight: 416,
    marginTop: 36,
    padding: '46px 21px 25px 25px',
  },
  field: {
    '& .MuiOutlinedInput-input::placeholder': {
      color: theme.palette.grey[500],
    },
  },
}));
