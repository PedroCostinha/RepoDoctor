export function normalizeRepository(value: string): string | null {
  const cleaned = value
    .trim()
    .replace(/\/+$/, '')
    .replace(/^https?:\/\/(?:www\.)?github\.com\//i, '')

  const match = cleaned.match(
    /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38}))\/([a-zA-Z0-9._-]+)$/
  )

  if (!match || match[2] === '.' || match[2] === '..') {
    return null
  }

  return `${match[1]}/${match[2]}`
}

export function getSharedRepository(search: string): string | null {
  const params = new URLSearchParams(search)

  return normalizeRepository(params.get('repo') ?? '')
}

export function createShareUrl(
  repository: string,
  currentPageUrl: string,
): string {
  const normalized = normalizeRepository(repository)

  if (!normalized) {
    throw new Error('Repositorio invalido para compartilhamento.')
  }

  const url = new URL(currentPageUrl)

  url.search = ''
  url.hash = ''
  url.searchParams.set('repo', normalized)

  return url.toString()
}
