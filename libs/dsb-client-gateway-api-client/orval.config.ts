module.exports = {
  apiClient: {
      input: {
          target: './schema.yaml'
      },
      output: {
          mode: 'single',
          client: 'react-query',
          target: './src/lib/client',
          override: {
              mutator: './src/response-type.ts'
          }
      }
  }
};
