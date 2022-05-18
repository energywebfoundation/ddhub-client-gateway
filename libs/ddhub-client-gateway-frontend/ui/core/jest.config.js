module.exports = {
  displayName: 'ui-core',
  preset: '../../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/dsb-client-gateway/ui/core',
};
