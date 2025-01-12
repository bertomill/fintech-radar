/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['newsapi.org', 'www.alphavantage.co'],
  },
}

module.exports = nextConfig