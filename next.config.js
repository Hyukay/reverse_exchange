/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
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

module.exports = nextConfig
