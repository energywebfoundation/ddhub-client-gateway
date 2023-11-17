import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import BrokerCard from '../../components/BrokerCard/BrokerCard';
import { Scheduler } from '../../components/Scheduler';
import {
  UserRole,
  useUserDataEffects,
} from '@ddhub-client-gateway-frontend/ui/login';

export function Dashboard() {
  const { configIsLoading, authEnabled, userAuth } = useUserDataEffects();
  const [displayScheduler, setDisplayScheduler] = useState(false);

  useEffect(() => {
    if (
      !(configIsLoading || (authEnabled && userAuth?.role !== UserRole.ADMIN))
    ) {
      setDisplayScheduler(true);
    }
  }, [configIsLoading, authEnabled, userAuth]);

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
