const path = require("node:path");

const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@styles": path.resolve(__dirname, "styles"),
    };

    return config;
  },
};

module.exports = nextConfig;
