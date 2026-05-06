declare module 'react-native-web' {
  // `react-native-web` package in this repo does not ship types in a way that
  // TS can find automatically from this shared package.
  // For our UI layer, re-exporting `react-native` types is sufficient.
  export * from 'react-native';
}

