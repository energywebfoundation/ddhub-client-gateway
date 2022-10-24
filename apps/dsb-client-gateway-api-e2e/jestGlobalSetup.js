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

  console.log('Configuring .env.test, .env.secret files');
};

module.exports = fn;
