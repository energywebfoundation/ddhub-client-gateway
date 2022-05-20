import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";

export const useWebsocketEffects = () => {
  useEffect(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => import('@asyncapi/web-component/lib/asyncapi-web-component'),
    []
  );

  const result = useQuery(
    'ws',
    async () => (await axios.get('/ws.yaml', { baseURL: '' }))?.data
  );
  return { schema: result.data };
};
