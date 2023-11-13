declare namespace Cypress {
  interface Chainable<Subject = any> {
    loginAdmin(): Chainable<any>;

    createChannel(payloadPath: string): Chainable<any>;

    createTopic(payload: any): Chainable<Cypress.Response<any>>;

    deleteTopic(topicId: string): Chainable<Cypress.Response<any>>;

    getTopic(name: string, owner: string): Chainable<Cypress.Response<any>>;

    deleteAllTopics(): Chainable<any>;

    setupPrivateKey(): Chainable<any>;

    cleanupChannel(payloadPath: string): Chainable<any>;

    getIdentity(): Chainable<Cypress.Response<any>>;

    generateTopicFixture(): Chainable<any>;

    loadFixture<T = any>(param: string): Chainable<T>;
  }
}

Cypress.Commands.add('getIdentity', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/identity',
  });
});

Cypress.Commands.add('loadFixture', (param: string) => {
  return cy.fixture(Cypress.env('CYPRESS_TARGET_ENV') + '/' + param);
});

Cypress.Commands.add('createChannel', (param: string) => {
  cy.loadFixture('topic/topic.json').then((payload) => {
    cy.request({
      method: 'POST',
      url: Cypress.env('CYPRESS_API_BASE_URL') + '/channel',
      body: payload,
      auth: {},
    });
  });
});

Cypress.Commands.add('setupPrivateKey', () => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/identity',
    body: {
      privateKey: Cypress.env('CYPRESS_API_PRIVATE_KEY'),
    },
  });
});

Cypress.Commands.add('loginAdmin', () => {
  if (!Cypress.env('CYPRESS_AUTH_ENABLED')) {
    cy.log('auth disabled');

    return;
  }

  return cy
    .request('POST', Cypress.env('CYPRESS_API_BASE_URL') + '/login', {
      username: Cypress.env('CYPRESS_ADMIN_USERNAME'),
      password: Cypress.env('CYPRESS_ADMIN_PASSWORD'),
    })
    .then((response) => {
      expect(response.body.accessToken).to.be.a('string');
      expect(response.body.refreshToken).to.be.a('string');

      Cypress.env('ACCESS_TOKEN', response.body.accessToken);

      return cy.wrap(response);
    });
});

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
  const token = Cypress.env('ACCESS_TOKEN');

  const apiKey = Cypress.env('CYPRESS_API_TOKEN');

  const defaults = {
    headers: {
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
