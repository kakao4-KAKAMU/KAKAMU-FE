const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');
/** @type {import("expo/metro-config").MetroConfig} */
const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, "../..")];
config.resolver.unstable_conditionNames = [
  "browser",       // 1순위: 브라우저 환경용 모듈
  "require",       // 2순위: CommonJS 방식
  "react-native",  // 3순위: 리액트 네이티브 환경용
];
module.exports = withNativewind(config, {
  input: './global.css',
  typescriptEnvPath: './nativewind-env.d.ts',
});
