/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... other configurations
    env: {
        WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
        CHAIN_ID: process.env.CHAIN_ID,
    },
};

export default nextConfig;