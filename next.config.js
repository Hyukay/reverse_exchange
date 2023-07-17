/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["bcrypt"],
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      //for loading .html files
      test: /\.html$/i,
      loader: 'html-loader'
    });

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.child_process = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback.dns = false;      
      config.resolve.fallback.readline = false;
    }

    return config;
  },
  images: {
    
    domains: [
      'a0.muscache.com',
      'avatars.dicebear.com',
      'upcdn.io',
      't4.ftcdn.net',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'ipfs.io',
      'ipfs.thirdwebstorage.com', // Add this line
      'gateway.ipfscdn.io',
    ]
  },
}

module.exports = nextConfig;
