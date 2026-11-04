# RepoDoctor

**Free and open-source GitHub repository health analyzer.**

RepoDoctor helps developers analyze public GitHub repositories,
identify good practices and discover opportunities for improvement.

## Features

- Analyze public GitHub repositories without signing in.
- View stars, forks, open issues and repository metadata.
- Detect README presence.
- Identify license, language, default branch and topics.
- Handle missing repositories and GitHub API errors.

## Run locally

Requires Node.js and npm.

    npm ci
    npm run dev

Open the local address shown by Vite.

## Quality checks

    npm run build
    npm run lint

## Technologies

- React
- TypeScript
- Vite
- GitHub REST API

## Roadmap

- [x] Initial interface
- [x] Public repository lookup
- [x] Basic GitHub API integration
- [ ] Repository health scoring
- [ ] Automated tests
- [ ] Portuguese and English translations
- [ ] Shareable reports
- [ ] GitHub Pages publication

## Limitations

RepoDoctor checks publicly available information.

It does not execute external code, perform a vulnerability audit,
or certify repository security.

Unauthenticated GitHub API requests are subject to rate limits.

## Author

[PedroCostinha](https://github.com/PedroCostinha)

## License

MIT - see [LICENSE](LICENSE).
