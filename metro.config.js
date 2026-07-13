const path = require('path');
const {getDefaultConfig} = require('@react-native/metro-config');
const {withMetroConfig} = require('react-native-monorepo-config');

const dirname = __dirname;
const shellRoot = path.resolve(dirname, '..');
const appNodeModules = path.resolve(dirname, 'node_modules');
const workspaces = [
  '../microapp1-rn',
  '../microapp2-rn',
  '../microapp3-rn',
  '../microfront1-rn',
  '../microfront2-rn',
  '../shared-rn',
];

/**
 * Metro configuration for Yarn Workspaces shell.
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(dirname), {
  root: dirname,
  dirname,
  workspaces,
});

config.watchFolders = Array.from(
  new Set([
    ...(config.watchFolders || []),
    shellRoot,
    ...workspaces.map(workspace => path.resolve(dirname, workspace)),
  ]),
);

config.resolver = {
  ...(config.resolver || {}),
  disableHierarchicalLookup: true,
  nodeModulesPaths: [appNodeModules],
  extraNodeModules: {
    ...((config.resolver && config.resolver.extraNodeModules) || {}),
    react: path.join(appNodeModules, 'react'),
    'react-native': path.join(appNodeModules, 'react-native'),
  },
};

module.exports = config;
