/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud'
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io'
      },
      // "ipfs.io", "gateway.pinata.cloud"
    ],
  },
};

export default nextConfig;
