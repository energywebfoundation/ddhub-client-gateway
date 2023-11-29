import { Wallet } from 'ethers';
import { faker } from '@faker-js/faker';

describe('Address book', () => {
  it('Happy path', () => {
    const randomWallet = Wallet.createRandom();

    cy.loginAdmin()
      .then(() => cy.setupPrivateKey())
      .then(() => {
        const payload = {
          did: 'did:ethr:volta:' + randomWallet.address,
          alias: 'cypress.' + faker.random.alphaNumeric(32),
        };

        return cy
          .createContact(payload)
          .then(() => cy.getAllContacts())
          .then((allContactsResponse) => {
            expect(allContactsResponse.body.length).to.gte(1);

            const matching = !!allContactsResponse.body.find(
              (contact) =>
                contact.did === payload.did && contact.alias === payload.alias
            );

            expect(matching).to.eq(true);

            return cy.deleteContact(payload.did);
          })
          .then(() => cy.getAllContacts())
          .then((allContactsResponse) => {
            if (allContactsResponse.body.length > 0) {
              const exists = !!allContactsResponse.body.find(
                (contact) =>
                  contact.did === payload.did && contact.alias === payload.alias
              );

              expect(exists).to.eq(false);
            }
          });
      });
  });
});
