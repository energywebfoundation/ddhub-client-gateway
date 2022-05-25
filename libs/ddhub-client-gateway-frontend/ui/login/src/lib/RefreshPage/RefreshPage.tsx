/* eslint-disable-next-line */
import { Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';


export function RefreshPage() {
  const { classes } = useStyles();

  const refreshPageHandler = () => {
    window.location.reload();
  };
  return (
    <Button
      className={classes.button}
      variant="outlined"
      color="primary"
      sx={{ marginTop: '33px' }}
      onClick={() => refreshPageHandler()}
      fullWidth
    >
      Refresh
    </Button>
  );
}

export default RefreshPage;

const useStyles = makeStyles()((theme) => ({
  button: {
    fontFamily: theme.typography.body2.fontFamily,
    textTransform: 'capitalize',
    fontWeight: 400,
    letterSpacing: '0.4px'
  }
}));
