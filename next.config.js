/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/blog/api/:path*',
        destination: 'https://api.linqingyang.com/blog/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig 