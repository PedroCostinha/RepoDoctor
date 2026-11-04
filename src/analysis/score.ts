export type Status = 'present' | 'absent' | 'unknown'

export type AnalysisInput = {
  readme: Status
  license: Status
  release: Status
  files?: string[]
  treeTruncated?: boolean
}

export type Check = {
  id: string
  label: string
  points: number
  status: Status
}

function findFile(
  input: AnalysisInput,
  patterns: RegExp[],
): Status {
  const paths = input.files?.map((path) =>
    path.replace(/\\/g, '/')
  )

  if (paths?.some((path) =>
    patterns.some((pattern) => pattern.test(path))
  )) {
    return 'present'
  }

  if (!paths || input.treeTruncated) {
    return 'unknown'
  }

  return 'absent'
}

export function calculateScore(input: AnalysisInput) {
  const checks: Check[] = [
    {
      id: 'readme',
      label: 'README encontrado',
      points: 20,
      status: input.readme,
    },
    {
      id: 'license',
      label: 'Licenca identificada',
      points: 15,
      status: input.license,
    },
    {
      id: 'ci',
      label: 'Workflow GitHub Actions encontrado',
      points: 15,
      status: findFile(input, [
        /^\.github\/workflows\/[^/]+\.(yml|yaml)$/i,
      ]),
    },
    {
      id: 'tests',
      label: 'Arquivos de testes encontrados',
      points: 15,
      status: findFile(input, [
        /(^|\/)(__tests__|tests|test)\/.+/i,
        /\.(test|spec)\.[cm]?[jt]sx?$/i,
        /(^|\/)test_[^/]+\.py$/i,
      ]),
    },
    {
      id: 'contributing',
      label: 'Guia de contribuicao encontrado',
      points: 10,
      status: findFile(input, [
        /(^|\/)CONTRIBUTING(\.(md|rst|txt))?$/i,
      ]),
    },
    {
      id: 'security',
      label: 'Politica de seguranca encontrada',
      points: 10,
      status: findFile(input, [
        /(^|\/)SECURITY\.md$/i,
      ]),
    },
    {
      id: 'docs',
      label: 'Documentacao adicional encontrada',
      points: 5,
      status: findFile(input, [
        /^(docs|documentation)\/.+\.(md|mdx|rst)$/i,
      ]),
    },
    {
      id: 'issues',
      label: 'Template de issue encontrado',
      points: 5,
      status: findFile(input, [
        /^\.github\/ISSUE_TEMPLATE\/.+\.(md|yml|yaml)$/i,
      ]),
    },
    {
      id: 'releases',
      label: 'Release publicada',
      points: 5,
      status: input.release,
    },
  ]

  const confirmedScore = checks
    .filter((check) => check.status === 'present')
    .reduce((total, check) => total + check.points, 0)

  const unknownPoints = checks
    .filter((check) => check.status === 'unknown')
    .reduce((total, check) => total + check.points, 0)

  const verifiedPoints = 100 - unknownPoints

  return {
    checks,
    confirmedScore,
    maxPossibleScore: confirmedScore + unknownPoints,
    verifiedPoints,
    complete: unknownPoints === 0,
  }
}
