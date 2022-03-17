require('dotenv').config({
  path: '.env.test',
});

const fn = () => {
  console.log('Configuring .env.test files');
};

module.exports = fn;
