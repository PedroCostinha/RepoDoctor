# RepoDoctor Scoring System

RepoDoctor analyzes public GitHub repositories and evaluates
nine observable repository practices.

The maximum score is 100 points.

## Scoring criteria

| Criterion | Points |
| --- | ---: |
| README found | 20 |
| License identified | 15 |
| GitHub Actions workflow found | 15 |
| Test files found | 15 |
| Contributing guide found | 10 |
| Security policy found | 10 |
| Additional documentation found | 5 |
| Issue template found | 5 |
| Published release found | 5 |
| **Total** | **100** |

## Status values

Each criterion has one of three statuses:

- **Present:** the expected evidence was detected.
- **Absent:** the available information indicates it was not found.
- **Unknown:** the required information could not be verified.

Unknown results are never automatically treated as absent.

## Score calculation

The confirmed score is the sum of points for criteria
marked as present.

When some criteria are unknown, RepoDoctor also provides
the maximum possible score.

Example:

- Confirmed points: 65
- Unknown points: 20
- Maximum possible score: 85
- Verified points: 80 out of 100

This is a partial analysis, not a definitive score.

## Detection methods

RepoDoctor uses public GitHub REST API responses.

- README: GitHub repository README endpoint.
- License: GitHub repository metadata.
- Workflows: files under .github/workflows.
- Tests: recognized test directories and file naming patterns.
- Contributing: a CONTRIBUTING guide in the repository tree.
- Security: a SECURITY.md file.
- Documentation: Markdown-like files in docs or documentation.
- Issue templates: recognized files under .github/ISSUE_TEMPLATE.
- Releases: published releases returned by the GitHub API.

File-based checks inspect repository paths.
They do not execute or validate the contents of those files.

## Incomplete GitHub API responses

GitHub may return an incomplete repository tree.

RepoDoctor retains evidence it has found but marks
unverified file-based criteria as unknown.

Network errors and API restrictions may also prevent
complete verification.

## Limitations

The score is an educational indicator of detected practices.

It does not measure:

- Actual test coverage or test quality.
- Correctness of GitHub Actions workflows.
- Documentation accuracy.
- Dependency or application vulnerabilities.
- Security of the analyzed repository.
- Code maintainability or architecture quality.

Even a score of 100 is not a security certification.

## Contributing

For improvements to the scoring rules, open a feature request
and describe the proposed criterion and expected behavior.

Changes to scoring rules should include automated tests.

See [CONTRIBUTING.md](../CONTRIBUTING.md).
