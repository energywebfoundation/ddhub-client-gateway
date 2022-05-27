module.exports = {
  displayName: 'ddhub-client-gateway-frontend-ui-gateway-settings',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/ddhub-client-gateway-frontend/ui/gateway-settings',
};
