/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure for serverless functions
  experimental: {
    serverComponentsExternalPackages: ['playwright-core', 'chrome-aws-lambda']
  },

  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },

  // Webpack config for serverless compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude problematic packages from client bundle
      config.externals = config.externals || [];
      config.externals.push('playwright-core', 'chrome-aws-lambda');
    }
    return config;
  },
};

module.exports = nextConfig;