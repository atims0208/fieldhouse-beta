let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vz-4f8c314d-49b.b-cdn.net',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  typescript: {
    // Enable type checking in production builds
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  eslint: {
    // Enable ESLint checking in production builds
    ignoreDuringBuilds: process.env.SKIP_TYPE_CHECK === 'true',
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Exclude API directory from compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('api')),
  webpack: (config, { isServer }) => {
    // Exclude the api directory from being processed
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [...(config.watchOptions?.ignored || []), '**/api/**']
    };
    return config;
  },
  output: 'standalone',
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
