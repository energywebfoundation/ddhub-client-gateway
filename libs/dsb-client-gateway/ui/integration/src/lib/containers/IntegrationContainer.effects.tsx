export const useIntegrationContainerEffects = () => {
  const restApiUrl = process.env['BACKEND_API_URL'] + '/docs';
  const websocketApiUrl = `ws://${process.env['BACKEND_API_URL']?.split('://').pop()}`;
  return { restApiUrl, websocketApiUrl };
};
