import Head from 'next/head';
import { Container } from '@mui/material';
import { TopicsContainer } from '@dsb-client-gateway/ui/topics';

export default function Topics() {

  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - Topics</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container maxWidth="lg">
          <TopicsContainer />
        </Container>
      </main>
    </div>
  );
}
