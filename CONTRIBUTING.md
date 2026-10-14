# Contributing to Transcendence Project

## Directory structure

- frontend/: frontend application and user interface
- backend/: server-side application, API and business logic
- infrastructure/: docker and deployment configuration
- README.md project overview and setup instructions
- CONTRIBUTING.md: contribution guidelines
- .gitignore: files excluded from Git

## Branching strategy

The project uses two main branches:

- main: stable and deliverable versions
- develop: integration branch for completed features


From this point, the following branches should be created from **develop** and merged back into **develop** through Pull Requests

- feature/<description>: new features
- fix/<description>: bug fixes
- docs/<description>: documentation changes
- refactor/<description>: code refactoring

Examples:

- feature/user-authentication
- fix/login-validation
- docs/update-contributing
- refactor/database-service

When a release is ready, changes can be merged from **develop** into **main** after a team review


## Commit message conventions

The commit messages follow Conventional Commits:
- feat: new features
- fix: bug fixes
- docs: documentation changes
- refactor: code refactoring
- test: test changes
- chore: maintenance tasks

Examples:
- feat: add user authentication
- fix: handle invalid credentials
- docs: document repository workflow
- chore: add gitignore rules

## Pull Request and code review procedure

1. Create a branch using the naming conventions
2. Make focused changes and write clear commit messages
3. Push the branch to the remote repository
4. Open a Pull Request targeting **develop** branch
5. Describe the changes and explain how to test them
6. Each Pull Request require approval from at least one team member other than the auhor
7. All review comments must be resolved before merging
8. Direct commits to both main and develop are not allowed.
9. All changes must be integrated through Pull Requests.

Direct commits to **main** are not allowed

Reviewers should check:
- Correctness and readability
- Security and accidental exposure of secrets
- Compatibility with the existing code
- Relevant tests and documentation
- Unnecessary files or unrelated changes

Reviews should be constructive and focused on improving the code

## .gitignore and Secrets

- Do not commit environment files containing real secrets, such as .env
- Never commit passwords, API keys, tokens or other credentials
- If any environment template is needed, use ``.env.example`` with placeholder values only


## General Guidelines
- Keep Pull Requests small and focused
- Communicate changes that affect other team members
- Test changes before opening a Pull Request
- Update documentation when necessary
- Follow the project's README for setup and execution instructions