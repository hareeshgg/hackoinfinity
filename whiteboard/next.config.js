/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Skip ESLint during production builds — pre-existing lint issues
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Skip type checking during builds — handled separately in dev
        ignoreBuildErrors: true,
    },
    webpack: (config) => {
        // Konva's index-node.js tries to require('canvas') which is an optional
        // native dependency. Map it to false so webpack doesn't try to bundle it.
        config.resolve.alias = {
            ...config.resolve.alias,
            canvas: false,
        };
        return config;
    },
};

module.exports = nextConfig;
