let { createConfig } = require('../../scripts/tasks/jest-resources');
let path = require('path');

const config = createConfig({
  setupFiles: [path.resolve(path.join(__dirname, 'config', 'tests.js'))],

  moduleNameMapper: {
    'office-ui-fabric-react/lib/(.*)$': 'office-ui-fabric-react/lib-commonjs/$1',
    '@uifabric/experiments/lib/(.*)': '<rootDir>/src/$1'
  },

  snapshotSerializers: [path.resolve(__dirname, './node_modules/@uifabric/jest-serializer-merge-styles')]
});

module.exports = config;
