import { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Container } from '@mui/material';
import { ApplicationContainer } from '../../components/Applications/ApplicationsContainer';
import { IAppDefinition } from '@energyweb/iam-contracts';

export default function ListApplications() {
  const {classes} = useStyles();
  const [applications, setApplications] = useState<IAppDefinition[]>([]);
  return (
    <div>
      <Container maxWidth="lg">
        <section className={classes.table}>
          {applications ? <ApplicationContainer applications={applications}/> : null}
        </section>
      </Container>
    </div>
  );
}
const useStyles = makeStyles()((theme) => ({
  table: {
    marginTop: '1rem',
  }
}));

