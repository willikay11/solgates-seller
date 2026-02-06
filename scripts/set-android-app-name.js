#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const APP_VARIANT = process.env.APP_VARIANT;
const androidDir = path.join(__dirname, '../android');
const stringsXmlPath = path.join(androidDir, 'app/src/main/res/values/strings.xml');

// Exit silently if android directory doesn't exist yet (before prebuild)
if (!fs.existsSync(androidDir)) {
  console.log('Android directory not found, skipping app name update');
  process.exit(0);
}

// Exit silently if strings.xml doesn't exist yet
if (!fs.existsSync(stringsXmlPath)) {
  console.log('strings.xml not found, skipping app name update');
  process.exit(0);
}

const getAppName = () => {
  if (APP_VARIANT === 'development') {
    return 'Solgates Seller (Dev)';
  }
  if (APP_VARIANT === 'preview') {
    return 'Solgates Seller (Prev)';
  }
  return 'Solgates Seller';
};

const appName = getAppName();

console.log(`Setting Android app name to: ${appName}`);

// Read the current strings.xml
let stringsXml = fs.readFileSync(stringsXmlPath, 'utf8');

// Replace the app_name
stringsXml = stringsXml.replace(
  /<string name="app_name">.*?<\/string>/,
  `<string name="app_name">${appName}</string>`,
);

// Write back to strings.xml
fs.writeFileSync(stringsXmlPath, stringsXml, 'utf8');

console.log('Android app name updated successfully');
