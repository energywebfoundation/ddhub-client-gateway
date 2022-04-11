/* eslint-disable-next-line */
import { Button } from '@mui/material';


export function RefreshPage() {
  const refreshPageHandler = () => {
    window.location.reload();
  }
  return (
    <Button
      variant='outlined'
      color="primary"
      sx={{marginTop: '17px'}}
      onClick={() => refreshPageHandler()}
      fullWidth>
      Refresh
    </Button>
  );
}

export default RefreshPage;
