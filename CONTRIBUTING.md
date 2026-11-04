# Contributing to RepoDoctor

Thank you for your interest in RepoDoctor!

RepoDoctor is a free, open-source tool that analyzes
public GitHub repository practices.

## Getting started

1. Read the README and check existing issues.
2. Discuss major changes in an issue before implementing them.
3. Fork the repository and create a focused branch.
4. Make your changes and validate them locally.
5. Open a pull request describing the change.

## Local development

Requirements: Node.js 22.12+ and npm.

    npm ci
    npm run dev

## Required checks

Before submitting a pull request, run:

    npm run test
    npm run build
    npm run lint

## Pull request guidelines

- Keep changes focused and easy to review.
- Explain what changed and why.
- Add or update tests when changing behavior.
- Preserve existing functionality.
- Document any new user-facing features.
- Never commit secrets, API tokens or personal data.

## Reporting bugs

Use the Bug report issue form.

Include reproduction steps and expected behavior.
Only share publicly accessible repository information.

## Suggesting improvements

Use the Feature request issue form.

Describe the problem, proposed solution and
how it would help RepoDoctor users.

## Security

Do not publish passwords, tokens, private data or
security-sensitive exploit details in public issues.

## License

By contributing, you agree that your contributions
will be licensed under the repository's MIT License.
