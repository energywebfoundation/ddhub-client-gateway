// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './topic-commands';
import './channel-commands';
import './address-book-commands';
import './message-commands';
import './ovewrite-commands';
// Alternatively you can use CommonJS syntax:
// require('./commands')

// beforeAll(async () => {
//   Cypress.env('CYPRESS_RUN_ID', uuidv4());
//
//   cy.log('run id ' + Cypress.env('CYPRESS_RUN_ID'));
//
//   cy.request({
//     method: 'GET',
//     url: Cypress.env('CYPRESS_API_BASE_URL'),
//   });
// });
