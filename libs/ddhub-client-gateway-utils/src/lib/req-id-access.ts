import { storage } from 'nestjs-pino/storage.js';

export const reqIdAccess = () => {
  const d = storage.getStore();

  const props = d.logger[Object.getOwnPropertySymbols(d.logger)[2]];

  if (!props) {
    return undefined;
  }

  const reqPass = props.split(',').find((t) => t.startsWith('"req":'));

  if (!reqPass) {
    return undefined;
  }

  return reqPass.split(':')[2].split('"').join('');
};
