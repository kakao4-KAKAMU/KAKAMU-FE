const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');
/** @type {import("expo/metro-config").MetroConfig} */
const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, "../..")];
module.exports = withNativewind(config, {
  input: './global.css',
  typescriptEnvPath: './nativewind-env.d.ts',
});
