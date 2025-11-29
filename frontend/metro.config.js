// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround for the node:sea issue on Windows with Node.js 17+
config.resolver.unstable_enableSymlinks = false;

// Disable problematic externals that cause the node:sea issue
config.resolver.nodeModulesExts = ['ts', 'tsx', 'js', 'jsx', 'json'];

module.exports = config;