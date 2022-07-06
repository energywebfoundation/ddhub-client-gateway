import { Button, Container, Stack, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useStyles } from '../../Login.styles';

export interface EnrolForRoleProps {
  onEnrolmentSubmit: () => void;
}

export function EnrolForRole(props: EnrolForRoleProps) {
  const { classes } = useStyles();

  return (
    <>
      <Stack
        spacing={'11px'}
        alignItems="center"
        direction={'row'}
        paddingTop={'33px'}
      >
        <ErrorOutline color={'warning'} />
        <Typography variant={'body2'} fontSize={'18px'}>
          Unauthorized
        </Typography>
      </Stack>
      <Container sx={{ marginLeft: '11px', paddingTop: '6px' }}>
        <Typography variant={'body2'}>
          No role to access DDHub Client Gateway.
        </Typography>
        <Button
          className={classes.submitBtn}
          variant="contained"
          color="primary"
          sx={{ marginTop: '26px' }}
          onClick={() => props.onEnrolmentSubmit()}
          fullWidth
        >
          Enrol
        </Button>
      </Container>
    </>
  );
}

export default EnrolForRole;
