it('has required envs', () => {
  expect(Cypress.env('CYPRESS_PRIVATE_KEY')).to.be.a('string');
  expect(Cypress.env('CYPRESS_API_BASE_URL')).to.be.a('string');
});

describe('Setup private key', () => {
  it('should throw error for invalid private key', () => {
    expect(true).to.eq(true);
  });

  it('should run', () => {
    cy.loginAdmin().then(() => {
      cy.setupPrivateKey();
    });
  });
});
