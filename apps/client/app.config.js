/** @type {import("expo/config").ExpoConfig} */

const config = {
  "expo": {
    "name": "filma",
    "slug": "filma",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "filma",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "bundleIdentifier": "com.kakamu.filma",
      "supportsTablet": true,
      "googleServicesFile": process.env.NODE_ENV === 'development' ? "./firebase-config/GoogleService-Info-Dev.plist" : "./firebase-config/GoogleService-Info-Prod.plist"
    },
    "android": {
      "package": "com.kakamu.filma",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "googleServicesFile": process.env.NODE_ENV === 'development' ? "./firebase-config/google-services-dev.json" : "./firebase-config/google-services-prod.json"
    },
    "web": {
      "bundler": "metro",
      "output": "server",
      "favicon": "./assets/images/favicon.png",
      "startUrl": process.env.EXPO_PUBLIC_HOST_PATH || "/",
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "backgroundColor": "#ffffff"
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static",
            "forceStaticLinking": [
              "@react-native-firebase/app",
              "@react-native-firebase/auth",
              "RNFBApp",
              "RNFBAuth"
            ]
          }
        }
      ]
    ],
    "experiments": {
      "baseUrl": process.env.EXPO_PUBLIC_HOST_PATH || "/",
      "typedRoutes": true
    }
  }
}

module.exports = config;