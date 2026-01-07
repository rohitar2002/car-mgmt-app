/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true, // Recommended for catching issues early
  env: {
    APP_FIREBASE_API_KEY: process.env.APP_FIREBASE_API_KEY,
    APP_FIREBASE_AUTHDOMAIN: process.env.APP_FIREBASE_AUTHDOMAIN,
    APP_FIREBASE_PROJECTID: process.env.APP_FIREBASE_PROJECTID,
    APP_FIREBASE_STORAGE_BUCKET: process.env.APP_FIREBASE_STORAGE_BUCKET,
    APP_FIREBASE_MESSAGE_SENDER_ID: process.env.APP_FIREBASE_MESSAGE_SENDER_ID,
    APP_FIREBASE_APP_ID: process.env.APP_FIREBASE_APP_ID,
  }
};

module.exports = nextConfig;
