Cypress.Commands.add('sendMessage', (payload: object) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/messages',
    body: payload,
  });
});

Cypress.Commands.add('receiveMessage', (fqcn: string, restArgs: object) => {
  const requestObject = {
    fqcn,
    ...restArgs,
  };

  return cy.request({
    method: 'GET',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/messages',
    qs: requestObject,
  });
});
