import { storage } from 'nestjs-pino/storage.js';

type PinoLikeLogger = {
  bindings?: () => Record<string, unknown>;
  [key: symbol]: unknown;
};

const readId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return null;
};

const extractReqIdFromBindings = (
  bindings: Record<string, unknown> | undefined,
): string | null => {
  if (!bindings) {
    return null;
  }

  const req = bindings.req;
  if (req && typeof req === 'object' && 'id' in req) {
    const reqId = readId((req as { id?: unknown }).id);
    if (reqId) {
      return reqId;
    }
  }

  return readId(bindings.runId) ?? readId(bindings.reqId);
};

const extractReqIdFromLegacyProps = (props: unknown): string | null => {
  if (typeof props !== 'string') {
    return null;
  }

  const reqPass = props.split(',').find((t) => t.startsWith('"req":'));

  if (reqPass) {
    return reqPass.split(':')[2].split('"').join('');
  }

  const runIdPass = props.split(',').find((t) => t.startsWith('"runId":'));

  if (runIdPass) {
    return runIdPass.split(':')[1].split('"').join('');
  }

  return null;
};

export const reqIdAccess = (): string | null => {
  try {
    const store = storage.getStore();

    if (!store?.logger) {
      return null;
    }

    const logger = store.logger as PinoLikeLogger;

    if (typeof logger.bindings === 'function') {
      const fromBindings = extractReqIdFromBindings(logger.bindings());
      if (fromBindings) {
        return fromBindings;
      }
    }

    const symbols = Object.getOwnPropertySymbols(logger);
    const internalProps =
      symbols.length > 2 ? logger[symbols[2]] : undefined;

    if (internalProps && typeof internalProps === 'object') {
      const fromInternalBindings = extractReqIdFromBindings(
        internalProps as Record<string, unknown>,
      );
      if (fromInternalBindings) {
        return fromInternalBindings;
      }
    }

    return extractReqIdFromLegacyProps(internalProps);
  } catch {
    return null;
  }
};
