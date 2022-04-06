import { DefaultOptions } from 'react-query';

export const queryClientOptions: DefaultOptions = {
  queries: {
    retry: false,
    refetchOnWindowFocus: false
  },
};
