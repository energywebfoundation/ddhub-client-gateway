module.exports = {
  apiClient: {
      input: {
          target: './schema.yaml'
      },
      output: {
          mode: 'tags',
          client: 'react-query',
          target: './src/lib/client',
          override: {
              mutator: './src/response-type.ts'
          }
      }
  }
};
