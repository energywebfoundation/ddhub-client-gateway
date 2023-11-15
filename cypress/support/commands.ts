declare namespace Cypress {
  // @TODO - Consider mixin instead of big interface
  interface Chainable<Subject = any> {
    // LOGIN
    loginAdmin(): Chainable<any>;

    // CHANNELS
    createChannel(payloadPath: string): Chainable<any>;

    cleanupChannel(payloadPath: string): Chainable<any>;

    // TOPICS
    createTopic(payload: any): Chainable<Cypress.Response<any>>;

    deleteTopic(topicId: string): Chainable<Cypress.Response<any>>;

    getTopic(name: string, owner: string): Chainable<Cypress.Response<any>>;

    deleteAllTopics(): Chainable<any>;

    listTopicVersions(topicId: string): Chainable<Cypress.Response<any>>;

    createTopicVersion(
      topicId: string,
      desiredVersion: string,
      fixture: object
    ): Chainable<Cypress.Response<any>>;

    getTopicVersions(topicId: string): Chainable<Cypress.Response<any>>;

    generateTopicFixture(version?: string): Chainable<any>;

    generateTopicVersionFixture(name: string, version: string): Chainable<any>;

    // IDENTITY/PRIVATE KEY
    getIdentity(): Chainable<Cypress.Response<any>>;

    setupPrivateKey(): Chainable<any>;

    // HELPERS
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
