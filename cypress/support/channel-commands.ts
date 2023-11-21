import { faker } from '@faker-js/faker';

Cypress.Commands.add('createChannel', (payload: object) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/channels',
    body: payload,
  });
});

Cypress.Commands.add(
  'createChannelWithTopic',
  (
    type: string = 'pub',
    messageForms: boolean = false,
    payloadEncryption: boolean = false
  ) => {
    const fqcn = 'cypress.' + faker.random.alphaNumeric(32);

    return cy.loadFixture('identity.json').then((fixture) => {
      return cy.generateTopicFixture().then((topicFixture) => {
        return cy.createTopic(topicFixture).then(() =>
          cy.createChannel({
            fqcn,
            type,
            messageForms,
            payloadEncryption,
            conditions: {
              dids: [fixture.did],
              roles: [],
              responseTopics: [],
              topics: [
                {
                  topicName: topicFixture.name,
                  owner: topicFixture.owner,
                },
              ],
            },
          })
        );
      });
    });
  }
);

Cypress.Commands.add('getChannelByFqcn', (fqcn: string) => {
  return cy.request({
    method: 'GET',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/channels/' + fqcn,
  });
});

Cypress.Commands.add('deleteChannel', (fqcn: string) => {
  return cy.request({
    method: 'DELETE',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/channels/' + fqcn,
  });
});

Cypress.Commands.add('getAllChannels', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/channels',
  });
});
