import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uzttjedryajsmngvpaqu.supabase.co', port: '', pathname: '/**' },
    ],
  },
};

export default nextConfig;
