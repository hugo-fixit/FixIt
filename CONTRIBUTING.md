# CONTRIBUTING

## How to contribute to this project

First, fork this repository by clicking the fork button.

Next, clone your forked repo.

```bash
git clone --recursive https://github.com/hugo-fixit/FixIt.git && cd FixIt
```

Then, install the dev dependencies.

```bash
npm install
```

And now you are ready to go!

Here are some useful commands.

```bash
# build theme.js with babel
npm run babel
# build theme.js and then build the static site
npm run build
# run a local debugging server with watch
npm run server
# run a local debugging server with watch in production environment
npm run server:production
# build theme.js and then run a local debugging server
npm run start
# build theme.js and then run a local debugging server in production environment
npm run start:production

```

Finally, create a new pull request at <https://github.com/hugo-fixit/FixIt/pulls> to submit your contribution 🎉

## Git standard for developers

### Branches

| Branch | Description |
| :-- | :-- |
| master | _The branch open to the public and release versions_ |
| dev | _The development branch of the next version_ |
| RC branch | _The release candidate branch of the next version, e.g. v0.2.12-RC_ |
| single feature | _The branch to enhancements or fixes_ |

### Merge events

| event | merge |
| :-- | :-- |
| release | **RC branch => master:** `--rebase` |
| PR | **others:master => master:** `--rebase` |
| single feature| **feature branch => RC branch:** `--merge` |

### Commit message

#### Format

`[{emoji} ]{type}[({module})]: {subject within 50 words}[ (#{issue/pull request})]`

example:

- :tada: Feat: add shortcode fixit-encryptor shortcode (#123)
- :arrow_up: Chore(libs): update Artalk from 2.2.12 to 2.3.4 (#150)

#### Emoji

- <https://gitmoji.dev>
- [vscode plugin](https://github.com/maixiaojie/git-emoji-zh.git)
- utools plugin `GitEmoji`

#### Message

| Emoji                                         | Type     | Example                                                      | Description (No Ambiguous)                                   |
| :-------------------------------------------- | :------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| :tada:  <br>:sparkles:                        | Feat     | Feat: add {feature}                                          | new feature                                                  |
| :truck:                                       |          | Feat: adjust/migrate {feature name}, {change details}        | For the adjustment feature, it is necessary to describe the current situation (before) and after adjustment (after) |
| :fire:                                        |          | Feat: delete {feature name}, {deletion reason}               | If the feature is deleted, the reason for deletion must be explained |
| :bug: <br>:construction: <br>:rotating_light: | Fix      | Fix: fix {bug description}                                   | Fix known bugs                                               |
| :art: <br>:lipstick: <br>:pencil2:            | Style    | Style: Typesetting/CSS style {optimizing content}            | Changes that do not affect code operation, such as code layout and style change |
| :recycle:                                     | Refactor | Refactor: override {feature name}                            | It is neither a new function nor a code change to fix a bug. Simply rewriting the code of a function does not affect the function result |
| :zap:                                         | Perf     | Perf: improve performance {function name}, {improve content} | Optimize code performance                                    |
| :rewind:                                      | Revert   | Revert: restore version {commit message of restore version}  | Restore the version of one commit                            |
| :pencil: <br>:pencil2:                              | Docs     | Docs: revise comments/update documents                     | Adjustment of documents and notes                            |
| :wrench:                                      | Chore    | Chore: update plugin version                                 | Changes in the construction process or auxiliary tools       |
