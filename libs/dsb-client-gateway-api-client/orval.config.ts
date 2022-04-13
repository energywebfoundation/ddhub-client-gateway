module.exports = {
  apiClient: {
      input: {
          target: './schema.yaml'
      },
      output: {
          mode: 'single',
          client: 'react-query',
          target: './src/lib/client',
          mock: true,
          override: {
              mutator: './src/response-type.ts'
          }
      }
  }
};
