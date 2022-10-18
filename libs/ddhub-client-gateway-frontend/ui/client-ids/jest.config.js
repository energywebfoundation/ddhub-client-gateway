module.exports = {
  displayName: 'dsb-client-gateway-ui-client-ids',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/dsb-client-gateway/ui/client-ids',
};
