# Contributing

This is a personal project, but changes still follow a lightweight reviewable workflow.

## Branches

`main` is the stable, verified branch. Work happens in short-lived branches:

- `feat/*` — new functionality;
- `fix/*` — bug fixes;
- `content/*` — writing and project material;
- `design/*` — visual and interaction changes;
- `ci/*` — automation and repository infrastructure;
- `docs/*` — documentation only.

Start each branch from the current `main` and keep it focused on one outcome.

## Commits

Use Conventional Commit-style messages:

```text
feat(scope): add a capability
fix(scope): correct a defect
content(projects): publish a project story
```

Prefer a small number of meaningful commits over one commit per file or per edit.

## Pull requests

1. Run `cd site && npm run verify` locally.
2. Push the branch and open a pull request into `main`.
3. Wait for the `Site verify` GitHub Actions check.
4. Squash-merge the pull request and delete the branch.

Visual changes should also be checked at desktop and mobile widths before merge.
