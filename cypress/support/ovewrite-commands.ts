import { v4 as uuidv4 } from 'uuid';

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
  const token = Cypress.env('ACCESS_TOKEN');

  const apiKey = Cypress.env('CYPRESS_API_TOKEN');

  if (!Cypress.env('CYPRESS_RUN_ID')) {
    Cypress.env('CYPRESS_RUN_ID', uuidv4());
  }

  const defaults = {
    headers: {
      'x-request-id': Cypress.env('CYPRESS_RUN_ID'),
      Accept: 'application/json',
      ...(token
        ? {
            authorization: 'Bearer ' + token,
          }
        : {}),
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
  };

  const optionsObject = options[0];

  if (optionsObject === Object(optionsObject)) {
    optionsObject.headers = {
      ...defaults.headers,
      ...optionsObject.headers,
    };

    return originalFn(optionsObject);
  }

  return originalFn(...options);
});
