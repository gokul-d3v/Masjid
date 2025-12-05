// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Override the resolver with appropriate settings
config.resolver = {
  ...config.resolver,
  unstable_enableSymlinks: false,
  nodeModulesExts: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

module.exports = config;