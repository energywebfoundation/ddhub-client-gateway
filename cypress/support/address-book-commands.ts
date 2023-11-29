Cypress.Commands.add('createContact', (payload: object) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/contacts',
    body: payload,
  });
});

Cypress.Commands.add('deleteContact', (did: string) => {
  return cy.request({
    method: 'DELETE',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/contacts/' + did,
  });
});

Cypress.Commands.add('getAllContacts', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.env('CYPRESS_API_BASE_URL') + '/contacts',
  });
});
