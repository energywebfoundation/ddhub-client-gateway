import { useWebsocketEffects } from './Websocket.effects';
import dynamic from 'next/dynamic';

const AsyncApiComponent = dynamic(
  () => import('@asyncapi/react-component/browser'),
  { ssr: false }
);

export const Websocket = () => {
  const { schema } = useWebsocketEffects();

  if (!schema || typeof navigator === 'undefined') {
    return null;
  }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  return <AsyncApiComponent schema={schema} />;
};
