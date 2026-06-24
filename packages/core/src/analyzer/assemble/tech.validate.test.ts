import { describe, expect, it } from 'vitest'
import { ValidationError } from '../../error'
import { validateTechOutput } from './tech.validate'

describe('validateTechOutput', () => {
  it('accepts the expected tech output shape', () => {
    expect(
      validateTechOutput({
        stack: 'TypeScript, Next.js',
        notableLibraries: ['next', 'react'],
        dependencyInsights: ['next indicates a Next.js application.'],
      })
    ).toEqual({
      stack: 'TypeScript, Next.js',
      notableLibraries: ['next', 'react'],
      dependencyInsights: ['next indicates a Next.js application.'],
    })
  })

  it('normalizes stack arrays into the public stack string', () => {
    expect(
      validateTechOutput({
        stack: ['TypeScript', 'Next.js', 'Node.js'],
      }).stack
    ).toBe('TypeScript, Next.js, Node.js')
  })

  it('treats a bare string array as the stack', () => {
    expect(validateTechOutput(['TypeScript', 'Next.js'])).toEqual({
      stack: 'TypeScript, Next.js',
    })
  })

  it('builds a stack string from common alternate model fields', () => {
    expect(
      validateTechOutput({
        languages: ['TypeScript'],
        frameworks: ['Next.js', 'React'],
        runtime: 'Node.js',
        packageManager: 'pnpm',
      }).stack
    ).toBe('TypeScript, Next.js, React, Node.js, pnpm')
  })

  it('normalizes library object arrays to names', () => {
    expect(
      validateTechOutput({
        stack: 'TypeScript',
        notableLibraries: [{ name: 'next' }, { package: 'react' }],
        dependencyInsights: [{ summary: 'Uses Next.js for app routing.' }],
      })
    ).toEqual({
      stack: 'TypeScript',
      notableLibraries: ['next', 'react'],
      dependencyInsights: ['Uses Next.js for app routing.'],
    })
  })

  it('rejects output without any usable stack evidence', () => {
    expect(() => validateTechOutput({ notableLibraries: ['next'] })).toThrow(
      ValidationError
    )
  })
})
