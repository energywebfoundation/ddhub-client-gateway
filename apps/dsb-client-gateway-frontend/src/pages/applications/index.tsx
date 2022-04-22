import Head from 'next/head';
import { Applications } from '@dsb-client-gateway/ui/applications';

export default function ListApplications() {
  return (
    <>
      <Head>
        <title>EW-DSB Client Gateway - Applications</title>
        <meta
          name="description"
          content="EW-DSB Client Gateway - Applications"
        />
      </Head>

      <main>
        <Applications />
      </main>
    </>
  );
}
