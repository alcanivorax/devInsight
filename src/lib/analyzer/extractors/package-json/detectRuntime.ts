export function detectRuntime(
  dependencies: string[],
  engines?: any
): string | null {
  // Check engines field first
  if (engines) {
    if (engines.bun) return 'Bun'
    if (engines.deno) return 'Deno'
    if (engines.node) return 'Node.js'
  }

  // Detect from dependencies
  if (dependencies.includes('elysia')) return 'Bun'
  if (dependencies.some((d) => d.startsWith('@deno/'))) return 'Deno'

  // Default to Node.js for backend frameworks
  const backendFrameworks = [
    'express',
    'fastify',
    '@nestjs/core',
    'koa',
    'hapi',
    '@hapi/hapi',
    '@trpc/server',
    'hono',
    'next',
    'nuxt',
    'gatsby',
    '@remix-run/react',
  ]

  if (dependencies.some((d) => backendFrameworks.includes(d))) {
    return 'Node.js'
  }

  return null
}
