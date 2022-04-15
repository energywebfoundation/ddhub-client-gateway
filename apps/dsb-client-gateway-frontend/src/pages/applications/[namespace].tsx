import Head from 'next/head';
import { Container } from '@mui/material';
import { Applications } from '@dsb-client-gateway/ui/applications';

export default function Application() {
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - Application</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container maxWidth="lg">
          <Applications />
        </Container>
      </main>
    </div>
  );
}
