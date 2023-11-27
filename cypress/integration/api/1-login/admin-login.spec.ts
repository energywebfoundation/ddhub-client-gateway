it('has required envs', () => {
  expect(Cypress.env('CYPRESS_ADMIN_USERNAME')).to.be.a('string');
  expect(Cypress.env('CYPRESS_ADMIN_PASSWORD')).to.be.a('string');

  expect(Cypress.env('CYPRESS_USER_USERNAME')).to.be.a('string');
  expect(Cypress.env('CYPRESS_USER_PASSWORD')).to.be.a('string');

  expect(Cypress.env('CYPRESS_API_BASE_URL')).to.be.a('string');
});

describe('Login', () => {
  it('should login as admin', () => {
    cy.loginAdmin();
  });
});
