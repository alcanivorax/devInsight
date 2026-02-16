import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: [
    'zod',
    'ai',
    '@ai-sdk/google',
    '@ai-sdk/provider-utils',
    '@ai-sdk/gateway',
    '@openrouter/sdk',
  ],
}

export default nextConfig
