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
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        unoptimized: true,
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    typescript: {
        ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
    },
    eslint: {
        ignoreDuringBuilds: process.env.SKIP_TYPE_CHECK === 'true',
    },
    output: 'standalone',
}

module.exports = nextConfig
