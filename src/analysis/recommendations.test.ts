import { describe, expect, it } from 'vitest'
import { calculateScore } from './score'
import { getRecommendations } from './recommendations'

describe('RepoDoctor recommendations', () => {
  it('recommends all missing criteria', () => {
    const result = calculateScore({
      readme: 'absent',
      license: 'absent',
      release: 'absent',
      files: [],
    })

    const recommendations = getRecommendations(result.checks)

    expect(recommendations).toHaveLength(9)
    expect(recommendations.reduce(
      (total, item) => total + item.points, 0
    )).toBe(100)
  })

  it('does not recommend detected practices', () => {
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
        '.github/ISSUE_TEMPLATE/bug.yml',
      ],
    })

    expect(getRecommendations(result.checks)).toEqual([])
  })

  it('does not treat unknown results as missing', () => {
    const result = calculateScore({
      readme: 'present',
      license: 'absent',
      release: 'unknown',
    })

    const recommendations = getRecommendations(result.checks)

    expect(recommendations.map((item) => item.id))
      .toEqual(['license'])
  })

  it('prioritizes higher-point recommendations', () => {
    const result = calculateScore({
      readme: 'absent',
      license: 'absent',
      release: 'absent',
      files: [],
    })

    const recommendations = getRecommendations(result.checks)

    expect(recommendations[0].id).toBe('readme')
    expect(recommendations[0].points).toBe(20)

    expect(recommendations.every(
      (item) => item.docsUrl.startsWith('https://docs.github.com/')
    )).toBe(true)

    for (let i = 1; i < recommendations.length; i++) {
      expect(recommendations[i].points)
        .toBeLessThanOrEqual(recommendations[i - 1].points)
    }
  })
})
