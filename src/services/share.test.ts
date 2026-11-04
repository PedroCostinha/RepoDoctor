import { describe, expect, it } from 'vitest'
import {
  normalizeRepository,
  getSharedRepository,
  createShareUrl,
} from './share'

describe('RepoDoctor shareable reports', () => {
  it('accepts owner/repository format', () => {
    expect(normalizeRepository('PedroCostinha/RepoDoctor'))
      .toBe('PedroCostinha/RepoDoctor')
  })

  it('accepts GitHub repository URLs', () => {
    expect(normalizeRepository(
      'https://github.com/PedroCostinha/RepoDoctor/'
    )).toBe('PedroCostinha/RepoDoctor')
  })

  it('rejects invalid repository names', () => {
    expect(normalizeRepository('invalid')).toBeNull()
    expect(normalizeRepository('owner/..')).toBeNull()
  })

  it('reads a repository from a shared URL', () => {
    expect(getSharedRepository(
      '?repo=PedroCostinha%2FRepoDoctor'
    )).toBe('PedroCostinha/RepoDoctor')
  })

  it('ignores invalid shared URL parameters', () => {
    expect(getSharedRepository('?repo=invalid')).toBeNull()
    expect(getSharedRepository('')).toBeNull()
  })

  it('creates a clean link preserving the Pages path', () => {
    const result = createShareUrl(
      'PedroCostinha/RepoDoctor',
      'https://pedrocostinha.github.io/RepoDoctor/?old=1#report',
    )

    expect(result).toBe(
      'https://pedrocostinha.github.io/RepoDoctor/?repo=PedroCostinha%2FRepoDoctor'
    )
  })

  it('rejects invalid repository sharing', () => {
    expect(() => createShareUrl(
      'invalid',
      'https://pedrocostinha.github.io/RepoDoctor/',
    )).toThrow()
  })
})
