
export const useIntegrationContainerEffects = () => {
  const restApiUrl = process.env['BACKEND_API_URL'] + '/docs';
  const websocketApiUrl = process.env['BACKEND_API_URL'] + '/swagger-ui';
  return { restApiUrl, websocketApiUrl };
};
