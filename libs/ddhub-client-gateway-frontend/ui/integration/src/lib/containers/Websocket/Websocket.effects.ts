import axios from "axios";
import { useQuery } from "react-query";

export const useWebsocketEffects = () => {
  const result = useQuery(
    'ws',
    async () => (await axios.get('/ws.yaml', { baseURL: '' }))?.data
  );
  return { schema: result.data };
};
