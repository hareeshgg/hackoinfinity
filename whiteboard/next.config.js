// whiteboard/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Prevent bundling the native canvas module on the client side
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                canvas: false,   // tell webpack to ignore the canvas package
            };
        }
        return config;
    },
};

module.exports = nextConfig;
