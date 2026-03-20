/** @type {import('next').NextConfig} */
const nextConfig = {
  // When you access Next.js dev from another device (e.g. http://192.168.1.3:3000),
  // Next blocks HMR/dev-resource websocket requests unless the origin is allowed.
  allowedDevOrigins: ["192.168.1.3"],
};

module.exports = nextConfig;

