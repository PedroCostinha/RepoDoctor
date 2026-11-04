import { afterEach, describe, expect, it, vi } from 'vitest'
import { inspectRepository } from './githubAnalysis'

const api = 'https://api.github.com/repos/PedroCostinha/RepoDoctor'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('GitHub repository inspection', () => {
  it('scores all criteria when evidence exists', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('/readme')) {
        return new Response('{}', { status: 200 })
      }

      if (url.includes('/git/trees/')) {
        return Response.json({
          truncated: false,
          tree: [
            '.github/workflows/ci.yml',
            'src/app.test.ts',
            'CONTRIBUTING.md',
            'SECURITY.md',
            'docs/guide.md',
            '.github/ISSUE_TEMPLATE/bug.md',
          ].map((path) => ({ path, type: 'blob' })),
        })
      }

      return Response.json([{ tag_name: 'v1.0.0' }])
    }))

    const result = await inspectRepository(api, 'main', {})

    expect(result.readme).toBe('found')
    expect(result.analysis.confirmedScore).toBe(100)
    expect(result.analysis.complete).toBe(true)
  })

  it('does not penalize unavailable API data', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('/readme')) {
        return new Response('{}', { status: 200 })
      }

      return new Response('{}', { status: 503 })
    }))

    const result = await inspectRepository(api, 'main', {})

    expect(result.analysis.confirmedScore).toBe(35)
    expect(result.analysis.maxPossibleScore).toBe(100)
    expect(result.analysis.complete).toBe(false)
  })

  it('detects an empty repository analysis', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('/readme')) {
        return new Response(null, { status: 404 })
      }

      if (url.includes('/git/trees/')) {
        return Response.json({ truncated: false, tree: [] })
      }

      return Response.json([])
    }))

    const result = await inspectRepository(api, 'main', null)

    expect(result.analysis.confirmedScore).toBe(0)
    expect(result.analysis.complete).toBe(true)
  })
})
