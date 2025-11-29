// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround for the node:sea issue on Windows with Node.js 17+
config.resolver.unstable_enableSymlinks = false;
config.resolver.nodeModulesExts = ['ts', 'tsx', 'js', 'jsx', 'json'];

// Completely disable the externals feature that's causing the node:sea issue
if (config.resolver.resolveRequest) {
  const originalResolveRequest = config.resolver.resolveRequest;
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Avoid resolving node:sea modules that cause the issue
    if (moduleName.startsWith('node:sea')) {
      throw new Error(`Module not found: ${moduleName}`);
    }
    return originalResolveRequest(context, moduleName, platform);
  };
} else {
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName.startsWith('node:sea')) {
      throw new Error(`Module not found: ${moduleName}`);
    }
    // Default resolution
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, { paths: [context.originModulePath] })
    };
  };
}

module.exports = config;