declare namespace Cypress {
  // @TODO - Consider mixin instead of big interface
  interface Chainable<Subject = any> {
    // LOGIN
    loginAdmin(): Chainable<any> | any;

    // MESSAGING
    sendMessage(payload: object): Chainable<Cypress.Response<any>>;

    receiveMessage(
      fqcn: string,
      restArgs: object
    ): Chainable<Cypress.Response<any>>;

    // ADDRESS BOOK

    getAllContacts(): Chainable<Cypress.Response<any>>;

    deleteContact(did: string): Chainable<Cypress.Response<any>>;

    createContact(payload: object): Chainable<Cypress.Response<any>>;

    // CHANNELS
    createChannel(payload: object): Chainable<Cypress.Response<any>>;

    getAllChannels(): Chainable<Cypress.Response<any>>;

    updateChannel(
      fqcn: string,
      payload: object
    ): Chainable<Cypress.Response<any>>;

    deleteChannel(fqcn: string): Chainable<Cypress.Response<any>>;

    createChannelWithTopic(
      type: string,
      messageForms: boolean,
      payloadEncryption: boolean
    ): Chainable<Cypress.Response<any>>;

    getChannelByFqcn(fqcn: string): Chainable<Cypress.Response<any>>;

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
    timeout: 30000,
  });
});

Cypress.Commands.add('loginAdmin', () => {
  if (!Cypress.env('CYPRESS_AUTH_ENABLED')) {
    cy.log('auth disabled');

    return cy.wrap(
      new Cypress.Promise((resolve) => {
        resolve();
      })
    );
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
