import Head from 'next/head';
import { TopicsContainer } from '@ddhub-client-gateway-frontend/ui/topics';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export default function Topics() {
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - Topics</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <TopicsContainer readonly={true}
          versionHistoryUrl={routerConst.ChannelTopicVersionHistory}
        />
      </main>
    </div>
  );
}
