import Head from 'next/head';
import { Applications } from '@dsb-client-gateway/ui/applications';

export default function ListApplications() {
  return (
    <>
      <Head>
        <title>EW-DSB Client Gateway - My Applications</title>
        <meta
          name="description"
          content="EW-DSB Client Gateway - My Applications"
        />
      </Head>

      <main>
        <Applications role="user" />
      </main>
    </>
  );
}
