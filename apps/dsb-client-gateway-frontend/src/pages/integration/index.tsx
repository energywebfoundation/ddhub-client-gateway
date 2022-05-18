import Head from 'next/head';
import { IntegrationContainer } from '@ddhub-client-gateway-frontend/ui/integration';

export default function Documentation() {
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - Documentation</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <IntegrationContainer />
      </main>
    </div>
  );
}
