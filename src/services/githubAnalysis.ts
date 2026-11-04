import { calculateScore, type Status } from '../analysis/score'

export type ReadmeStatus = 'found' | 'missing' | 'unknown'

export type Inspection = {
  readme: ReadmeStatus
  analysis: ReturnType<typeof calculateScore>
}

const headers = {
  Accept: 'application/vnd.github+json',
}

async function checkReadme(api: string): Promise<ReadmeStatus> {
  try {
    const response = await fetch(`${api}/readme`, { headers })

    if (response.ok) return 'found'
    if (response.status === 404) return 'missing'

    return 'unknown'
  } catch {
    return 'unknown'
  }
}

async function checkFiles(api: string, branch: string): Promise<{
  files?: string[]
  treeTruncated?: boolean
}> {
  try {
    const url = `${api}/git/trees/${encodeURIComponent(branch)}?recursive=1`
    const response = await fetch(url, { headers })

    if (!response.ok) return {}

    const data: unknown = await response.json()

    if (!data || typeof data !== 'object') return {}

    const tree = data as {
      tree?: Array<{ path?: string; type?: string }>
      truncated?: boolean
    }

    if (!Array.isArray(tree.tree) ||
        typeof tree.truncated !== 'boolean') {
      return {}
    }

    const files = tree.tree
      .filter((item) =>
        item.type === 'blob' && typeof item.path === 'string'
      )
      .map((item) => item.path as string)

    return {
      files,
      treeTruncated: tree.truncated,
    }
  } catch {
    return {}
  }
}

async function checkReleases(api: string): Promise<Status> {
  try {
    const response = await fetch(
      `${api}/releases?per_page=1`,
      { headers },
    )

    if (!response.ok) return 'unknown'

    const data: unknown = await response.json()

    if (!Array.isArray(data)) return 'unknown'

    return data.length > 0 ? 'present' : 'absent'
  } catch {
    return 'unknown'
  }
}

export async function inspectRepository(
  api: string,
  defaultBranch: string,
  license: object | null | undefined,
): Promise<Inspection> {
  const [readme, tree, release] = await Promise.all([
    checkReadme(api),
    checkFiles(api, defaultBranch),
    checkReleases(api),
  ])

  const readmeStatus: Status =
    readme === 'found' ? 'present' :
    readme === 'missing' ? 'absent' : 'unknown'

  const licenseStatus: Status =
    license === undefined ? 'unknown' :
    license === null ? 'absent' : 'present'

  return {
    readme,
    analysis: calculateScore({
      readme: readmeStatus,
      license: licenseStatus,
      release,
      files: tree.files,
      treeTruncated: tree.treeTruncated,
    }),
  }
}
