/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Two dev servers (parallel Claude sessions) sharing one .next dir corrupt
  // each other's webpack chunks. Opt a second server into its own dist dir:
  //   NEXT_DIST_DIR=.next-alt npx next dev -p 3003
  distDir: process.env.NEXT_DIST_DIR || '.next',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },

  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  async headers() {
    return [
      {
        // Clarity session replays rebuild the page inside an iframe on
        // clarity.microsoft.com and re-fetch our assets cross-origin. Fonts
        // (and canvas-read images) are CORS-enforced by browsers, so without
        // this header every replay falls back to serif system fonts even when
        // the CSS loads. Static assets only; no credentials involved.
        source: '/_next/static/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
      {
        // Same reason: photos and brand assets under /public used by the
        // pages (unsplash/, industries/, proxe/).
        source: '/:dir(unsplash|industries|proxe)/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/industries/ecommerce',
        destination: '/industries/d2c',
        permanent: true,
      },
      {
        source: '/industries/fitness',
        destination: '/industries/wellness',
        permanent: true,
      },
      {
        source: '/proxe',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
