import { Button, Box, Stack, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useStyles } from '../../Login.styles';

export interface EnrolForRoleProps {
  onEnrolmentSubmit: () => void;
}

export function EnrolForRole(props: EnrolForRoleProps) {
  const { classes } = useStyles();

  return (
    <Stack spacing={4} mt={2}>
      <Stack spacing={1} direction={'row'}>
        <ErrorOutline color={'warning'} />
        <Stack>
          <Typography>Unauthorized</Typography>
          <Typography variant={'body2'}>
            No role to access DDHub Client Gateway.
          </Typography>
        </Stack>
      </Stack>
      <Button
        className={classes.submitBtn}
        variant="contained"
        color="primary"
        onClick={() => props.onEnrolmentSubmit()}
        fullWidth
      >
        Enrol
      </Button>
    </Stack>
  );
}

export default EnrolForRole;
