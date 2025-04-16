/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['vz-4f8c314d-49b.b-cdn.net'], // Add your Bunny.net domain
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    }
}

module.exports = nextConfig
