import { describe, expect, it } from 'vitest'
import { calculateScore } from './score'

describe('RepoDoctor scoring engine', () => {
  it('returns 100 for all detected criteria', () => {
    const result = calculateScore({
      readme: 'present',
      license: 'present',
      release: 'present',
      files: [
        '.github/workflows/ci.yml',
        'src/app.test.ts',
        'CONTRIBUTING.md',
        'SECURITY.md',
        'docs/guide.md',
        '.github/ISSUE_TEMPLATE/bug.md',
      ],
    })

    expect(result.confirmedScore).toBe(100)
    expect(result.maxPossibleScore).toBe(100)
    expect(result.complete).toBe(true)
  })

  it('returns zero when no criteria are found', () => {
    const result = calculateScore({
      readme: 'absent',
      license: 'absent',
      release: 'absent',
      files: ['src/index.ts'],
    })

    expect(result.confirmedScore).toBe(0)
    expect(result.complete).toBe(true)
  })

  it('does not treat unavailable data as absent', () => {
    const result = calculateScore({
      readme: 'present',
      license: 'present',
      release: 'unknown',
    })

    expect(result.confirmedScore).toBe(35)
    expect(result.maxPossibleScore).toBe(100)
    expect(result.complete).toBe(false)
  })

  it('preserves detected files in a truncated tree', () => {
    const result = calculateScore({
      readme: 'present',
      license: 'absent',
      release: 'absent',
      files: ['.github/workflows/ci.yml'],
      treeTruncated: true,
    })

    expect(result.checks.find((c) => c.id === 'ci')?.status)
      .toBe('present')

    expect(result.checks.find((c) => c.id === 'tests')?.status)
      .toBe('unknown')
  })
})
