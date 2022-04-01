import { Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';

export interface EnrolForRoleProps {
  onEnrolmentSubmit: () => void
}

export function EnrolForRole(props: EnrolForRoleProps) {
  return (
    <>
        <Stack spacing={1} alignItems="center" direction={'row'}>
          <ErrorOutline color={'warning'}/>
          <Typography variant={'h6'}>
            Unauthorized
          </Typography>
        </Stack>
        <Container sx={{marginLeft: '8px'}}>
          <Typography>
            No Role to access DDHub Client GW.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{marginTop: '17px'}}
            onClick={() => props.onEnrolmentSubmit()}
            fullWidth>
            Enrol
          </Button>
        </Container>
    </>
  );
}

export default EnrolForRole;
