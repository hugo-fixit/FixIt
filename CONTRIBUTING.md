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
# Run local server with demo content
pnpm dev

# Run local server with test content
pnpm test

# Run local server with documentation (requires fixit-docs as sibling directory)
pnpm dev:docs
```

> [!TIP]
>
> - You can run `pnpm dev -e production` or `pnpm test -e production` to check the production environment.
> - If you want to work on documentation-related theme changes, the simplest way is to have both `FixIt` and `fixit-docs` cloned as sibling directories.

### Building

```bash
# Build demo site
pnpm build

# Build test site
pnpm build:test

# Build both demo and test sites for deployment (includes public directory reorganization)
pnpm build:vercel
```

### Preview

```bash
# Preview the built site locally (requires build:vercel first)
pnpm preview
```

## Project Structure

Understanding the project structure will help you contribute more effectively:

```
FixIt/
├── archetypes/         # Content templates
├── assets/             # Theme assets (CSS, JS, images)
│   ├── css/            # SCSS stylesheets
│   ├── js/             # JavaScript files
│   └── lib/            # Third-party libraries
├── demo/               # Demo site for development
├── i18n/               # Internationalization files
├── layouts/            # Hugo template files
│   ├── _markup/        # Hugo render hooks
│   ├── _partials/      # Reusable template components
│   └── _shortcodes/    # Custom shortcodes
├── static/             # Static files
├── test/               # Test site content
├── package.json        # npm scripts and dependencies
└── hugo.toml           # Default theme configuration
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

## Git standard for developers

### Branches

| Branch         | Description                                            |
| :------------- | :----------------------------------------------------- |
| main           | _The development branch, may contain unstable updates_ |
| single feature | _The branch to enhancements or fixes_                  |

### Merge events

| event          | merge                                 |
| :------------- | :------------------------------------ |
| PR             | **others:main => main:** `--rebase`   |
| single feature | **feature branch => main:** `--merge` |

### Commit message

#### Format

`[{emoji} ]{type}[({scope})]: {subject within 50 words}[ (#{issue/pull request})]`

example:

- :tada: Feat: add shortcode fixit-encryptor shortcode (#123)
- :arrow_up: Chore(libs): update Artalk from 2.2.12 to 2.3.4 (#150)

#### Emoji

- <https://gitmoji.dev>
- [vscode plugin](https://github.com/maixiaojie/git-emoji-zh.git)
- utools plugin `GitEmoji`

#### Message

| Emoji                                         | Type     | Example                                                      | Description (No Ambiguous)                                                                                                               |
| :-------------------------------------------- | :------- | :----------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| :tada:<br>:sparkles:                          | Feat     | Feat: add {feature}                                          | new feature                                                                                                                              |
| :truck:                                       |          | Feat: adjust/migrate {feature name}, {change details}        | For the adjustment feature, it is necessary to describe the current situation (before) and after adjustment (after)                      |
| :fire:                                        |          | Feat: delete {feature name}, {deletion reason}               | If the feature is deleted, the reason for deletion must be explained                                                                     |
| :bug: <br>:construction: <br>:rotating_light: | Fix      | Fix: fix {bug description}                                   | Fix known bugs                                                                                                                           |
| :art: <br>:lipstick: <br>:pencil2:            | Style    | Style: Typesetting/CSS style {optimizing content}            | Changes that do not affect code operation, such as code layout and style change                                                          |
| :recycle:                                     | Refactor | Refactor: override {feature name}                            | It is neither a new function nor a code change to fix a bug. Simply rewriting the code of a function does not affect the function result |
| :zap:                                         | Perf     | Perf: improve performance {function name}, {improve content} | Optimize code performance                                                                                                                |
| :rewind:                                      | Revert   | Revert: restore version {commit message of restore version}  | Restore the version of one commit                                                                                                        |
| :pencil:<br>:pencil2:                         | Docs     | Docs: revise comments/update documents                       | Adjustment of documents and notes                                                                                                        |
| :wrench:                                      | Chore    | Chore: update plugin version                                 | Changes in the construction process or auxiliary tools                                                                                   |

> [!NOTE]
> The change log is automatically generated based on the commit message.\
> A add `(ignore)` or `(i)` scope to ignore including in.
