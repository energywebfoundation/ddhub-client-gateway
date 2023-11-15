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
