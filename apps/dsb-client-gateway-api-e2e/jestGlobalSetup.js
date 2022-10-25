const fn = () => {
  if (process.env.CI) {
    console.log('Running in CI');

    return;
  }

  require('dotenv').config({
    path: '.env.test',
  });

  require('dotenv').config({
    path: '.env.secret',
  });

  if (!process.env.PRIVATE_KEY_E2E) {
    throw new Error('env. variable PRIVATE_KEY_E2E is missing');
  }

  console.log('Configuring .env.test, .env.secret files');
};

module.exports = fn;
