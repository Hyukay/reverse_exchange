/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      //for loading .html files
      test: /\.html$/i,
      loader: 'html-loader'
    });
    return config;
  },
  images: {
    domains: [
      'a0.muscache.com',
      'avatars.dicebear.com',
      'upcdn.io',
      't4.ftcdn.net',
      'res.cloudinary.com', 
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
  },
}



module.exports = nextConfig;


/*  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        child_process: false
      };
    }
    config.module.rules.push({
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
        },
      ],
    });
  

    return config;
  },
}; */