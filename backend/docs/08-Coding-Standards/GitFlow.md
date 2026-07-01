# Git Branching & Workflow

Workora follows a standard Feature Branch workflow (similar to GitHub Flow).

## Branch Naming Convention
Branches should be created from `main` (or `develop` if applicable) and named according to their purpose and ticket number.
- **Feature**: `feature/WRK-123-add-leave-approval`
- **Bugfix**: `bugfix/WRK-124-fix-payroll-calc`
- **Hotfix**: `hotfix/WRK-125-prod-login-crash`

## Commit Messages
We follow the **Conventional Commits** specification. This allows automated changelog generation and semantic versioning.

Format: `<type>(<scope>): <subject>`

### Allowed Types:
- `feat`: A new feature (e.g., `feat(payroll): add pf calculation rules`)
- `fix`: A bug fix (e.g., `fix(auth): resolve token expiration issue`)
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

## Pull Requests (PRs)
1. **Title**: Must match the Conventional Commits specification.
2. **Reviewers**: Require at least one approval from a senior engineer.
3. **CI Checks**: All GitHub Actions (Build, Unit Tests, Linter) must pass before merging.
4. **Merge Strategy**: Use **Squash and Merge** to keep the `main` branch history clean.
