# CONTRIBUTING

Make sure that you follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) while contributing and engaging in the discussions.

## Prerequisites

Before you start contributing, make sure you have the following tools installed:

- **Node.js** (>= 20.0.0) - Required for package management and build tools
- **Hugo Extended** (>= 0.147.7) - The static site generator
- **pnpm** - Package manager (recommended)

You can check your installed versions:

```bash
node --version
hugo version
pnpm --version
```

## How to contribute to this project

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

Here are some useful commands for development:

### Development

```bash
# Start demo site development server
pnpm dev:demo
# Start test site development server
pnpm dev:test
# Start documentation development server (requires fixit-docs as sibling directory)
pnpm dev:docs
```

> [!TIP]
>
> - Add `-e production` to the development command to check the production environment, e.g. `pnpm dev:test -e production`.
> - For documentation-related theme changes, it is recommended to clone both `FixIt` and `fixit-docs` as sibling directories.

### Building

```bash
# Build demo site
pnpm build:demo
# Build test site
pnpm build:test
# Build all sites
pnpm build
```

### Preview

```bash
# Preview the built site locally (requires build first)
pnpm preview
```

## Project Structure

Understanding the project structure will help you contribute more effectively:

```
FixIt/
├── apps/               # Minimal sites
│   ├── demo/           # Demo site
│   └── test/           # Test site
├── archetypes/         # Content templates
├── assets/             # Theme assets
│   ├── css/            # SCSS stylesheets
│   ├── js/             # JavaScript files
│   ├── images/         # Image assets
│   └── lib/            # Third-party libraries
├── i18n/               # Internationalization files
├── layouts/            # Hugo template files
│   ├── _markup/        # Hugo render hooks
│   ├── _partials/      # Reusable template components
│   └── _shortcodes/    # Custom shortcodes
├── packages/           # Theme-related packages
├── static/             # Static files
├── hugo.toml           # Default theme configuration
└── package.json        # npm scripts and dependencies
```

## Development Workflow

1. **Make your changes** in the appropriate directories
2. **Test locally** using `pnpm dev` or `pnpm test`
3. **Check different environments** with production builds
4. **Verify documentation** changes with `pnpm dev:docs` (if applicable)
5. **Commit your changes** following the commit message format below

## Pull Request Guidelines

- Create a feature branch from `main`
- Make your changes with clear, focused commits
- Test your changes thoroughly
- Update documentation if needed
- Submit a pull request with a clear description

Finally, create a new pull request at <https://github.com/hugo-fixit/FixIt/pulls> to submit your contribution 🎉

## Git Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This enables automatic changelog generation using our custom template: [conventional.hbs](https://github.com/hugo-fixit/fixit-releaser/blob/main/src/changelog/conventional.hbs).
