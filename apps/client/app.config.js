/** @type {import("expo/config").ExpoConfig} */

const config = {
  "expo": {
    "name": "mobile",
    "slug": "mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "mobile",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
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
      ]
    ],
    "experiments": {
      "baseUrl": process.env.EXPO_PUBLIC_HOST_PATH || "/",
      "typedRoutes": true
    }
  }
}

module.exports = config;