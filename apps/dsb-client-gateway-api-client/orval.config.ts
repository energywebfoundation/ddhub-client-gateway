module.exports = {
  apiClient: {
      input: {
          target: './src/schema.yaml'
      },
      output: {
          mode: 'single',
          client: 'react-query',
          target: './src/client',
          override: {
              mutator: './src/response-type.ts'
          }
      }
  }
};
