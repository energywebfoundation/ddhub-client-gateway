import { Grid } from '@mui/material';
import BrokerCard from '../../components/BrokerCard/BrokerCard';
import { Scheduler } from '../../components/Scheduler';
import {
  UserRole,
  useUserDataEffects,
} from '@ddhub-client-gateway-frontend/ui/login';

const SCHEDULER_VISIBLE_ROLES: readonly string[] = [
  UserRole.ADMIN,
  UserRole.SUPERADMIN,
  UserRole.MESSAGING,
];

export function Dashboard() {
  const { configIsLoading, authEnabled, userAuth } = useUserDataEffects();
  const displayScheduler =
    !configIsLoading &&
    (!authEnabled || SCHEDULER_VISIBLE_ROLES.includes(userAuth?.role));

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={6} minWidth={546}>
        <BrokerCard />
      </Grid>
      {displayScheduler && (
        <Grid item xs={12} lg={6} minWidth={546}>
          <Scheduler />
        </Grid>
      )}
    </Grid>
  );
}

export default Dashboard;
