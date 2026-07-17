# Contributing

This is a personal project, so changes use a lightweight local branch workflow without pull requests.

## Branches

`main` is the stable, verified branch. Work happens in short-lived branches:

- `feat/*` — new functionality;
- `fix/*` — bug fixes;
- `content/*` — writing and project material;
- `design/*` — visual and interaction changes;
- `ci/*` — automation and repository infrastructure;
- `chore/*` — dependencies and development tooling;
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

## Local merge workflow

1. Update `main` and create a focused branch:

   ```bash
   git switch main
   git pull --ff-only
   git switch -c feat/example
   ```

2. Make and commit the change on the branch.
3. Run `cd site && bun run verify` locally. Visual changes should also be checked at desktop and mobile widths.
4. Merge the completed branch into `main` with an explicit merge commit, then push:

   ```bash
   git switch main
   git merge --no-ff feat/example
   git push origin main
   git branch -d feat/example
   ```

GitHub Actions verifies every push to `main`. Topic branches stay local unless a remote backup is useful.
