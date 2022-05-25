import { Button } from '@mui/material';
import { useStyles } from './RefreshPage.styles';

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
