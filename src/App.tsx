import { useState, type FormEvent } from 'react'
import './App.css'
import { inspectRepository, type Inspection } from './services/githubAnalysis'

type Repository = {
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  default_branch: string
  language: string | null
  topics: string[]
  license: {
    spdx_id: string
    name: string
  } | null
}

type ReadmeStatus = 'found' | 'missing' | 'unknown'

function parseRepository(value: string): string | null {
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

function App() {
  const [input, setInput] = useState('')
  const [repository, setRepository] = useState<Repository | null>(null)
  const [readme, setReadme] = useState<ReadmeStatus>('unknown')
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = parseRepository(input)

    if (!name) {
      setError('Informe uma URL valida ou usuario/repositorio.')
      return
    }

    setLoading(true)
    setError('')
    setRepository(null)
    setReadme('unknown')
    setInspection(null)

    try {
      const api = `https://api.github.com/repos/${name}`
      const headers = {
        Accept: 'application/vnd.github+json',
      }

      const response = await fetch(api, { headers })

      if (response.status === 404) {
        throw new Error('Repositorio nao encontrado ou nao publico.')
      }

      if (
        response.status === 429 ||
        (response.status === 403 &&
          response.headers.get('x-ratelimit-remaining') === '0')
      ) {
        throw new Error(
          'Limite da API do GitHub atingido. Tente novamente mais tarde.'
        )
      }

      if (!response.ok) {
        throw new Error(`Erro ao consultar o GitHub: ${response.status}`)
      }

      const data = (await response.json()) as Repository

      if (!data.full_name || !data.html_url) {
        throw new Error('O GitHub retornou dados incompletos.')
      }

      setRepository(data)

      const inspection = await inspectRepository(
        api,
        data.default_branch,
        data.license,
      )

      setReadme(inspection.readme)
      setInspection(inspection)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Nao foi possivel concluir a consulta.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">RD</span>
          <span>RepoDoctor</span>
        </div>
        <span className="version">MVP 1.0</span>
      </header>

      <main className="container">
        <section className="hero">
          <span className="eyebrow">GITHUB REPOSITORY ANALYZER</span>

          <h1>
            Seu repositorio
            <span> esta saudavel?</span>
          </h1>

          <p>
            Analise informacoes publicas dos seus projetos,
            descubra boas praticas e encontre oportunidades de melhoria.
          </p>

          <form className="search-form" onSubmit={analyze}>
            <label htmlFor="repository">
              Repositorio do GitHub
            </label>

            <div className="search-row">
              <input
                id="repository"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="PedroCostinha/RepoDoctor"
                autoComplete="off"
                disabled={loading}
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Analisando...' : 'Analisar'}
              </button>
            </div>
          </form>

          <p className="hint">
            Gratuito, sem cadastro e sem acesso a repositorios privados.
          </p>

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}
        </section>

        {repository && (
          <section className="report" aria-live="polite">
            <div className="report-heading">
              <div>
                <span className="eyebrow">RESULTADO DA CONSULTA</span>
                <h2>{repository.full_name}</h2>
                <p>
                  {repository.description || 'Sem descricao cadastrada.'}
                </p>
              </div>

              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-link"
              >
                Ver no GitHub
              </a>
            </div>

            <div className="stats">
              <div className="stat">
                <span>Estrelas</span>
                <strong>{repository.stargazers_count}</strong>
              </div>

              <div className="stat">
                <span>Forks</span>
                <strong>{repository.forks_count}</strong>
              </div>

              <div className="stat">
                <span>Issues abertas</span>
                <strong>{repository.open_issues_count}</strong>
              </div>
            </div>

            <div className="details">
              <div>
                <span>README</span>
                <strong>
                  {readme === 'found'
                    ? 'Encontrado'
                    : readme === 'missing'
                      ? 'Nao encontrado'
                      : 'Nao verificado'}
                </strong>
              </div>

              <div>
                <span>Licenca identificada</span>
                <strong>
                  {repository.license?.spdx_id || 'Nao identificada'}
                </strong>
              </div>

              <div>
                <span>Linguagem principal</span>
                <strong>{repository.language || 'Nao informada'}</strong>
              </div>

              <div>
                <span>Branch padrao</span>
                <strong>{repository.default_branch}</strong>
              </div>

              <div>
                <span>Topics</span>
                <strong>
                  {repository.topics?.length
                    ? repository.topics.join(', ')
                    : 'Nenhum identificado'}
                </strong>
              </div>
            </div>

            {inspection && (
              <section className="score-panel" aria-label="Diagnostico de boas praticas">
                <div className="score-summary">
                  <div>
                    <span className="eyebrow">REPOSITORY HEALTH</span>
                    <h3>Pontuacao confirmada</h3>
                    <p>
                      {inspection.analysis.verifiedPoints} de 100
                      pontos foram verificados.
                    </p>
                  </div>
                  <div className="score-number">
                    {inspection.analysis.confirmedScore}
                    <span>/100</span>
                  </div>
                </div>

                {!inspection.analysis.complete && (
                  <p className="score-warning" role="status">
                    Analise parcial. Com as verificacoes pendentes,
                    o resultado pode chegar a
                    {' '}{inspection.analysis.maxPossibleScore}/100.
                  </p>
                )}

                <h3>Criterios avaliados</h3>

                <div className="checks-grid">
                  {inspection.analysis.checks.map((check) => (
                    <div
                      key={check.id}
                      className="check-item"
                      data-status={check.status}
                    >
                      <div>
                        <strong>{check.label}</strong>
                        <span>
                          {check.status === 'present'
                            ? 'Identificado'
                            : check.status === 'absent'
                              ? 'Nao identificado'
                              : 'Nao verificado'}
                        </span>
                      </div>
                      <strong>{check.points} pts</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <p className="disclaimer">
              Esta e a primeira etapa do RepoDoctor.
              A pontuacao de qualidade sera adicionada quando
              o motor de regras estiver implementado e testado.
            </p>
          </section>
        )}
      </main>

      <footer>
        RepoDoctor — Open Source · Dados publicos do GitHub
      </footer>
    </div>
  )
}

export default App
