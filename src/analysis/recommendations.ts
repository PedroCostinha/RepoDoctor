import type { Check } from './score'

type Guidance = {
  title: string
  description: string
  docsUrl: string
}

export type Recommendation = Guidance & {
  id: string
  points: number
}

const guidance: Record<string, Guidance> = {
  readme: {
    title: 'Adicione um README',
    description: 'Crie um README.md explicando o objetivo, a instalacao e o uso do projeto.',
    docsUrl: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes',
  },
  license: {
    title: 'Defina uma licenca',
    description: 'Escolha uma licenca adequada e adicione o arquivo LICENSE.',
    docsUrl: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository',
  },
  ci: {
    title: 'Configure integracao continua',
    description: 'Adicione workflows para executar testes e verificacoes automaticamente.',
    docsUrl: 'https://docs.github.com/en/actions',
  },
  tests: {
    title: 'Adicione testes automatizados',
    description: 'Crie testes para os principais comportamentos do projeto.',
    docsUrl: 'https://docs.github.com/en/actions',
  },
  contributing: {
    title: 'Documente como contribuir',
    description: 'Adicione um CONTRIBUTING.md com instrucoes para contribuidores.',
    docsUrl: 'https://docs.github.com/en/communities',
  },
  security: {
    title: 'Adicione uma politica de seguranca',
    description: 'Crie SECURITY.md e informe como relatar vulnerabilidades.',
    docsUrl: 'https://docs.github.com/en/code-security',
  },
  docs: {
    title: 'Amplie a documentacao',
    description: 'Crie guias de utilizacao ou documentacao tecnica na pasta docs.',
    docsUrl: 'https://docs.github.com/en/repositories',
  },
  issues: {
    title: 'Crie modelos de issues',
    description: 'Configure formularios para erros e sugestoes em .github/ISSUE_TEMPLATE.',
    docsUrl: 'https://docs.github.com/en/communities',
  },
  releases: {
    title: 'Publique uma release',
    description: 'Crie uma versao identificada e publique notas de lancamento.',
    docsUrl: 'https://docs.github.com/en/repositories/releasing-projects-on-github',
  },
}

export function getRecommendations(checks: Check[]): Recommendation[] {
  return checks
    .filter((check) => check.status === 'absent')
    .flatMap((check) => {
      const guide = guidance[check.id]

      if (!guide) return []

      return [{
        id: check.id,
        points: check.points,
        ...guide,
      }]
    })
    .sort((a, b) => b.points - a.points)
}
