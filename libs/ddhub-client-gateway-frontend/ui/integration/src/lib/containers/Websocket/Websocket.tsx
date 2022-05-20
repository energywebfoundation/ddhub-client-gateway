import { useWebsocketEffects } from "./Websocket.effects";

export const Websocket = () => {
  const { schema } = useWebsocketEffects();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <asyncapi-component schema={schema} cssImportPath="../asyncapi.css" />;
};
