# CONTRIBUTING

Make sure that you follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) while contributing and engaging in the discussions.

## Prerequisites

Before you start contributing, make sure you have the following tools installed:

- **Hugo Extended** (>= 0.158.0) - The static site generator
- **Dart Sass** - Required for SCSS compilation
- **Node.js** (>= 22) - Required for package management and build tools
- **pnpm** - Package manager

You can check your installed versions:

```bash
hugo version
sass --version
node --version
pnpm --version
```

Check the Hugo environment information:

```bash
hugo env
```

## How to Contribute

First, fork this repository by clicking the fork button.

Next, clone your forked repo.

```bash
git clone https://github.com/hugo-fixit/FixIt.git && cd FixIt
```

Then, install the dev dependencies.

```bash
pnpm install
```

And now you are ready to go!

### Workflow

1. **Make your changes** in the appropriate directories
2. **Test locally** using `pnpm dev:demo` or `pnpm dev:test`
3. **Check code quality** with `pnpm lint` and `pnpm typecheck`
4. **Check different environments** with production builds (`pnpm build:demo` or `pnpm build:test`)
5. **Verify documentation** changes with `pnpm dev:docs` (if applicable)
6. **Commit your changes** following the commit message format below

### Commands

```bash
# Start demo site development server
pnpm dev:demo
# Start test site development server
pnpm dev:test
# Start documentation development server (requires fixit-docs as sibling directory)
pnpm dev:docs

# Build demo site
pnpm build:demo
# Build test site
pnpm build:test
# Build all sites
pnpm build

# Lint with ESLint
pnpm lint
# TypeScript type checking
pnpm typecheck

# Preview the built site locally (requires build first)
pnpm preview
```

> [!TIP]
>
> - Add `-e production` to the development command to check the production environment, e.g. `pnpm dev:test -e production`.
> - Add `-e debug` to enable debug mode (if applicable), e.g. `pnpm dev:test -e debug`.
> - For documentation-related theme changes, it is recommended to clone both `FixIt` and `fixit-docs` as sibling directories.

### Pull Request

- Create a feature branch from `main`
- Make your changes with clear, focused commits
- Test your changes thoroughly
- Update documentation if needed
- Submit a pull request with a clear description

Finally, create a new pull request at <https://github.com/hugo-fixit/FixIt/pulls> to submit your contribution.

---

## Project Structure

Understanding the project structure will help you contribute more effectively:

```
FixIt/
├── apps/               # Minimal sites
│   ├── demo/           # Demo site
│   └── test/           # Test site
├── archetypes/         # Content templates
├── assets/             # Theme assets
│   ├── images/         # Image assets
│   ├── js/             # JavaScript files
│   ├── lib/            # Third-party libraries
│   └── scss/           # SCSS stylesheets
├── i18n/               # Internationalization files
├── layouts/            # Hugo template files
│   ├── _markup/        # Hugo render hooks
│   ├── _partials/      # Reusable template components
│   └── _shortcodes/    # Custom shortcodes
├── packages/           # Theme-related packages (pnpm workspaces)
│   ├── shared/         # Shared utilities
│   ├── versioning/     # Version management (pre-commit)
│   └── integration/    # Post-build site merging
├── static/             # Static files
├── hugo.toml           # Default theme configuration
└── package.json        # npm scripts and dependencies
```

## Git Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This enables automatic changelog generation using our custom template: [conventional.hbs](https://github.com/Lruihao/auto-changelog-plus/blob/main/settings/conventional.hbs).

> [!NOTE]
>
> Commits in a PR will normally be squashed into one commit, so you don't need to rebase locally.

### Commit Message Format

```
<type>(<scope>): <subject>
^      ^         ^
|      |         |__ Subject: Concise description of the change (imperative mood, lowercase).
|      |____________ Scope: The specific part of the codebase affected (optional but recommended).
|___________________ Type: Indicates the kind of change.
```

> [!NOTE]
>
> - Keep the subject line concise and ideally within 72 characters.
> - If the change is more than a sentence, add a body.
> - Do not include secrets (tokens/keys) or personal data in commit messages.
> - Do not invent issue/PR numbers or facts that are not present in the diff.

### Allowed Types

- `feat`: A new feature.
- `fix`: A bug fix.
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `chore`: Changes to the build process, auxiliary tools, libraries, documentation generation etc.
- `docs`: Documentation only changes.
- Other conventional types like `perf`, `style`, `test`, `ci`, `build` are also acceptable.

### Allowed Scopes

- `workflow`: CI/CD workflow changes (`.github/workflows/`)
- `archetypes`: Content templates (`archetypes/`)
- `assets`: Changes to theme assets like CSS, JS (`assets/`)
- `i18n`: Internationalization and translation files (`i18n/`)
- `layouts`: Root-level Hugo template files (`layouts/*.html`)
- `config`: Theme configuration (`hugo.toml`, `theme.toml`)
- _(All top-level directories in the layouts and packages directories)_
- _(Consider adding other scopes as needed for better granularity)_

### Examples

- `feat(_shortcodes): add mapbox zoom control options`
- `fix(_partials): avoid duplicate canonical link tags`
- `docs(i18n): update translation key naming guidelines`
- `ci(workflow): optimize preview deployment cache`
- `refactor(assets): split theme initialization into smaller modules`
