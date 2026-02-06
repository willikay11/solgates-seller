const { withStringsXml } = require('@expo/config-plugins');

const withAppName = (config) => {
  return withStringsXml(config, (config) => {
    const appVariant = process.env.APP_VARIANT;

    let appName = 'Solgates Seller';
    if (appVariant === 'development') {
      appName = 'Solgates Seller (Dev)';
    } else if (appVariant === 'preview') {
      appName = 'Solgates Seller (Prev)';
    }

    // Update the app_name in strings.xml
    const strings = config.modResults.resources.string;
    const appNameIndex = strings.findIndex((item) => item.$.name === 'app_name');

    if (appNameIndex !== -1) {
      strings[appNameIndex]._ = appName;
    }

    return config;
  });
};

module.exports = withAppName;
