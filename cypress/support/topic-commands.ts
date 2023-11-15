import { faker } from '@faker-js/faker';

Cypress.Commands.add('listTopicVersions', (topicId: string) => {
  return cy.request({
    method: 'GET',
    url: Cypress.env('CYPRESS_API_BASE_URL') + `/topics/${topicId}/versions`,
  });
});

Cypress.Commands.add(
  'createTopicVersion',
  (topicId: string, desiredVersion: string, fixture: object) => {
    return cy.request({
      method: 'PUT',
      url:
        Cypress.env('CYPRESS_API_BASE_URL') +
        `/topics/${topicId}/versions/${desiredVersion}`,
      body: fixture,
    });
  }
);

Cypress.Commands.add(
  'generateTopicVersionFixture',
  (name: string, version: string) => {
    return cy.loadFixture('identity.json').then((fixture) => {
      return {
        name: name,
        version: version,
        tags: ['CYPRESS_TEST'],
        owner: fixture.owner,
        schemaType: 'JSD7',
        schema:
          '{\n   "type": "object",    "properties":{ "data":  {  "type": "number"\n} }  \n}',
      };
    });
  }
);

Cypress.Commands.add('generateTopicFixture', (version: string = '0.0.1') => {
  return cy.loadFixture('identity.json').then((fixture) => {
    return {
      name: faker.random.alpha(24),
      schemaType: 'JSD7',
      schema:
        '{\n   "type": "object",    "properties":{ "data":  {  "type": "number"\n} }  \n}',
      version: version,
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
