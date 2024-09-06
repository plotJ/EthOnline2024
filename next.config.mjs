/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

module.exports = {
    // ... other configurations
    env: {
      WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
      CHAIN_ID: process.env.CHAIN_ID,
    },
  };