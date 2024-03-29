import { storage } from 'nestjs-pino/storage.js';

export const reqIdAccess = (): string | null => {
  const d = storage.getStore();

  if (!d) {
    return null;
  }

  if (!d.logger) {
    return null;
  }

  const props = d.logger[Object.getOwnPropertySymbols(d.logger)[2]];

  if (!props) {
    return null;
  }

  const reqPass = props.split(',').find((t) => t.startsWith('"req":'));

  if (!reqPass) {
    const runIdPass = props.split(',').find((t) => t.startsWith('"runId":'));

    if (!runIdPass) {
      return null;
    }

    return runIdPass.split(':')[1].split('"').join('');
  }

  return reqPass.split(':')[2].split('"').join('');
};
