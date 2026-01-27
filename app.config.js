const pkg = require("./package.json");

const APP_ID_PREFIX = "com.solgates.solgatesSeller";

const EAS_APP_OWNER = "tukai-org";
const EAS_PROJECT_ID = "e3d29ac2-d02c-40d8-ad96-c0a2d8508316";
const EAS_UPDATE_URL = "https://u.expo.dev/e3d29ac2-d02c-40d8-ad96-c0a2d8508316";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getName = () => {
    if (IS_DEV) {
      return "Solgates Seller (Dev)";
    }
    if (IS_PREVIEW) {
      return "Solgates Seller (Prev)";
    }
  
    return "Solgates Seller";
};

const getAppId = () => {
    if (IS_DEV) {
      return `${APP_ID_PREFIX}.dev`;
    }
    if (IS_PREVIEW) {
      return `${APP_ID_PREFIX}.preview`;
    }
  
    return `${APP_ID_PREFIX}.app`;
};

module.exports = function (config) {
    const VERSION = pkg.version;

    let apiUrl = "https://api.solgates.com/api/v1";
    let frontendUrl = "https://solgates.com";

    if (IS_DEV || IS_PREVIEW) {
      apiUrl = 'https://api.staging.solgates.com/api/v1';
      frontendUrl = 'https://staging.solgates.com';
    }

    return {
        expo: {
            "name": getName(),
            "slug": "solgates-seller",
            "version": VERSION,
            "orientation": "portrait",
            "icon": "./assets/images/appIcon.png",
            "scheme": "myapp",
            "userInterfaceStyle": "automatic",
            "newArchEnabled": true,
            "ios": {
                "supportsTablet": true,
                "infoPlist": {
                  "LSApplicationQueriesSchemes": [
                    "whatsapp",
                    "instagram",
                    "whatsapp",
                    "instagram",
                    "whatsapp",
                    "instagram",
                    "whatsapp",
                    "instagram"
                  ],
                  "ITSAppUsesNonExemptEncryption": false
                },
                "bundleIdentifier": getAppId()
            },
            "android": {
                "icon": "./assets/images/appIcon.png",
                "adaptiveIcon": {
                  "foregroundImage": "./assets/images/foregroundImage.png",
                  "backgroundColor": "#EA580C"
                },
                "intentFilters": [
                  {
                    "action": "VIEW",
                    "data": {
                      "scheme": "https"
                    },
                    "category": [
                      "BROWSABLE",
                      "DEFAULT"
                    ]
                  }
                ],
                "permissions": [
                  "android.permission.READ_EXTERNAL_STORAGE",
                  "android.permission.WRITE_EXTERNAL_STORAGE",
                  "android.permission.RECORD_AUDIO",
                  "android.permission.READ_EXTERNAL_STORAGE",
                  "android.permission.WRITE_EXTERNAL_STORAGE",
                  "android.permission.RECORD_AUDIO"
                ],
                "package": getAppId()
              },
              "web": {
                "bundler": "metro",
                "output": "static",
                "favicon": "./assets/images/favicon.png"
              },
              "plugins": [
                "expo-router",
                [
                  "expo-image-picker",
                  {
                    "photosPermission": "The app accesses your photos to let you share them with your friends."
                  }
                ],
                "./plugins/withAppName"
              ],
              "experiments": {
                "typedRoutes": true
              },
              "extra": {
                "router": {
                  "origin": false
                },
                "eas": {
                  "projectId": EAS_PROJECT_ID
                },
                "API_URL": apiUrl,
                "FRONTEND_URL": frontendUrl,
              },
              "owner": EAS_APP_OWNER,
              "runtimeVersion": "1.0.0",
              "updates": {
                "url": EAS_UPDATE_URL
              }
        }
    }
}