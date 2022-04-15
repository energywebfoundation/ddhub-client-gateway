import { makeStyles } from 'tss-react/mui';
import { Container } from '@mui/material';
import { AppsAndTopics } from '@dsb-client-gateway/ui/applications';

export default function ListApplications() {
  const {classes} = useStyles();
  return (
    <div>
      <Container maxWidth="lg">
        <section className={classes.table}>
           <AppsAndTopics />
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

