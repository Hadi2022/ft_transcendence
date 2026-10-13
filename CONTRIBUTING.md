# Contributing to Transcendence Project

## Directory structure

- frontend/: frontend application and user interface
- backend/: server-side application, API and business logic
- infraestructure/: docker and deployment configuration
- README.md project overview and setup instructions
- CONTRIBUTING.md: contribution guidelines
- .gitignore: files excluded from Git

## Branching strategy

Two important branches:

- main: stable and deliverable versions
- develop: integration branch for completed features


From this point, the following branches should be created from **develop** and merged back into **develop** through Pull Requests

- feature/<description>: new features
- fix/<description>: bug fixes
- docs/<description>: documentation changes
- refactor/<description>: code refactoring


## Commit message conventions

The commit messages follow Conventional Commits:
- feat: new features
- fix: bug fixes
- docs: documentation changes
- refactor: code refactoring
- test: test changes
- chore: maintenance tasks

A few examples:
- feat: add user authentication
- fix: handle invalid credentials
- docs: document repository workflow

## Pull Request and code review procedure

1. Create a branch using the naming conventions
2. Make focused changes and write clear commit messages
3. Push the branch to the remote repository
4. Open a Pull Request targeting **develop** branch
5. Describe the changes and explain how to test them
6. Request a review from at least one teammate
7. Address review comments and ensure relevant checks pass
8. Merge only after approval

Direct commits to **main** are not allowed

Reviewers should check:
- Correctness and readability
- Security and accidental exposure of secrets
- Compatibility with the existing code
- Relevant tests and documentation
- Unnecessary files or unrelated changes

Reviews should be constructive and focused on improving the code


## General Guidelines
- Keep Pull Requests small and focused
- Communicate changes that affect other team members
- Test changes before opening a Pull Request
- Update documentation when necessary
- Follow the project's README for setup and execution instructions