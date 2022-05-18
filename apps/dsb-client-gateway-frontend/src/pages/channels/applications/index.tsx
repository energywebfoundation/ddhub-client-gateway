import Head from 'next/head';
import { Applications } from '@dsb-client-gateway/ui/applications';
import { routerConst } from '@dsb-client-gateway/ui/utils';

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
        <Applications role="user" topicUrl={routerConst.ChannelTopics} />
      </main>
    </>
  );
}
