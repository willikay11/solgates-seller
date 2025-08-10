const pkg = require("./package.json");

const APP_ID_PREFIX = "com.solgates.solgatesSeller";

const EAS_APP_OWNER = "willikay11";
const EAS_PROJECT_ID = "46128557-00c6-4042-8823-8f7075c6b713";
const EAS_UPDATE_URL = "https://u.expo.dev/46128557-00c6-4042-8823-8f7075c6b713";

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

    console.log(`Building ${getAppId()}...`);

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
                ]
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
                "API_URL": "https://api.staging.solgates.com/api/v1",
              },
              "owner": EAS_APP_OWNER,
              "runtimeVersion": "1.0.0",
              "updates": {
                "url": EAS_UPDATE_URL
              }
        }
    }
}