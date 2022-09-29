const fn = () => {
  if (process.env.CI) {
    console.log('Running in CI');

    return;
  }

  require('dotenv').config({
    path: '.env.test',
  });

  console.log('Configuring .env.test files');
};

module.exports = fn;
