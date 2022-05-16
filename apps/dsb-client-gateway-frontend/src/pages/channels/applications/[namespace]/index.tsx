import Head from 'next/head';
import { TopicsContainer } from '@dsb-client-gateway/ui/topics';
import { routerConst } from '@dsb-client-gateway/ui/utils';

export default function Topics() {
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - Topics</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <TopicsContainer
          versionHistoryUrl={routerConst.ChannelTopicVersionHistory}
        />
      </main>
    </div>
  );
}
