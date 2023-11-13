import { faker } from '@faker-js/faker';

Cypress.Commands.add('generateTopicFixture', () => {
  return cy.loadFixture('identity.json').then((fixture) => {
    return {
      name: faker.random.alpha(24),
      schemaType: 'JSD7',
      schema:
        '{\n   "type": "object",    "properties":{ "data":  {  "type": "number"\n} }  \n}',
      version: '1.0.0',
      owner: fixture.owner,
      tags: ['CYPRESS_TEST'],
    };
  });
});

Cypress.Commands.add('getTopic', (name: string, owner: string) => {
  return cy.request({
    method: 'GET',
    url:
      Cypress.env('CYPRESS_API_BASE_URL') +
      `/topics?name=${name}&owner=${owner}`,
  });
});

Cypress.Commands.add('deleteTopic', (topicId: string) => {
  return cy.request({
    method: 'DELETE',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/topics/' + topicId,
  });
});

Cypress.Commands.add('createTopic', (payload: any) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/topics',
    body: payload,
  });
});
