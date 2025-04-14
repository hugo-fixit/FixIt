# CONTRIBUTING

Make sure that you follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) while contributing and engaging in the discussions.

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

Here are some useful commands.

```bash
# run a local debugging server with watch
pnpm server
# run a local debugging server with watch in production environment
pnpm server:production
```

If you want to do docs-related theme changes, the simplest way is to have both `FixIt` and `fixit-docs` cloned as sibling directories, and then run:

```bash
pnpm server:docs
```

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

> [!note]
> The change log is automatically generated based on the commit message.\
> Use `Chore` type or add `(ignore)` scope to ignore including in.
