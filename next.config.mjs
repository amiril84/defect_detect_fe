/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'objects-defect-detection-backend-production.up.railway.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  output: 'standalone'
};

export default nextConfig;
