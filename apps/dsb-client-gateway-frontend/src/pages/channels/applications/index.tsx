import Head from 'next/head';
import { Applications } from '@ddhub-client-gateway-frontend/ui/applications';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

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
