const path = require('path');
const {getDefaultConfig} = require('@react-native/metro-config');
const {withMetroConfig} = require('react-native-monorepo-config');

const dirname = __dirname;

/**
 * Metro configuration for Yarn Workspaces shell.
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = withMetroConfig(getDefaultConfig(dirname), {
  root: path.resolve(dirname, '..'),
  dirname,
  workspaces: [
    'microapp1-rn',
    'microapp2-rn',
    'microapp3-rn',
    'microfront1-rn',
    'microfront2-rn',
    'shared-rn',
  ],
});
