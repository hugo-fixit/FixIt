# Changelog

All notable changes to this project will be documented in this file.
<!-- Releases see https://github.com/hugo-fixit/FixIt/releases -->

## v0.2.18 [2023.3.31]

> **Note**
> This will be the last relatively stable 0.x release, after which the first major release will be incompatible with all previous 0.x releases
> Snapshot: <>

## :boom: Breaking Updates

- Refactor author data config [#288](https://github.com/hugo-fixit/FixIt/pull/288)

## :new: What's New

- :tada: Feat: add natively support mermaid with code fences ([#230](https://github.com/hugo-fixit/FixIt/issues/230))
- :tada: Feat: add breadcrumb navigation ([#309](https://github.com/hugo-fixit/FixIt/pull/309))
- :sparkles: Feat: add instant page (@Mejituu [#279](https://github.com/hugo-fixit/FixIt/pull/279))
- :sparkles: Feat: add `force` option value to `params.page.lightgallery`
- :sparkles: Feat: add loop parameter for typeit ([#303](https://github.com/hugo-fixit/FixIt/pull/303))
- :sparkles: Feat: add paramater strict for giscus comment
- :bug: Fix: donate images without lazy loading (@Mejituu [#279](https://github.com/hugo-fixit/FixIt/pull/279))
- :bug: Fix: discordinvite typo (@mathieu-gilloots [#282](https://github.com/hugo-fixit/FixIt/pull/282))
- :bug: Fix: missing parameter `requiredFields` for Valine
- :bug: Fix: js.build is executed after fingerprint, resulting in the destruction of js integrity
- :bug: Fix: toc fails when the toc aside is on the left
- :bug: Fix: APlayer invades the click event of the anchor links, resulting in invalid Chinese anchor links scrolling ([#292](https://github.com/hugo-fixit/FixIt/issues/292))
- :bug: Fix: resolve style conflicts between valine and animate.css ([#304](https://github.com/hugo-fixit/FixIt/issues/304))
- :bug: Fix: version `v0.2.17` is not compatible with previous versions
- :bug: Fix: `crypto-js/md5.js` and `crypto-js/sha256.js` cdn path error
- :bug: Fix:  HackTheBox social link not in the right format ([#308](https://github.com/hugo-fixit/FixIt/issues/308))
- :recycle: Refactor: image lazy loading ([#283](https://github.com/hugo-fixit/FixIt/pull/283))
- :recycle: Refactor: author's avatar of post or profile ([#288](https://github.com/hugo-fixit/FixIt/pull/288))
- :recycle: Refactor: language switch in desktop header ([#306](https://github.com/hugo-fixit/FixIt/pull/306))
- :recycle: Refactor(reward): add parameter `mode` for post reward and refactor shortcode `reward`
- :wheelchair: Feat: add post update date to post meta ([#285](https://github.com/hugo-fixit/FixIt/issues/285))
- :art: Style: fix `#comments` css style conflict ([#269](https://github.com/hugo-fixit/FixIt/issues/269))
- :art: Style: adjust the mobile header style and fix the bug that scrolling is invalid when there are too many menus on mobile ([#289](https://github.com/hugo-fixit/FixIt/issues/289))
- :art: Perf: optimize the scroll bar style of body and toc-auto elements
- :memo: Docs: refactor the theme documentation
- :wrench: Chore: change the theme minimum supported Hugo versions above **0.109.0**
- :arrow_up: Chore(libs):
  - Update Update @waline/client from 2.10.0 to 2.14.7 (@Mejituu [#279](https://github.com/hugo-fixit/FixIt/pull/279))
  - Update typeit from 8.7.0 to 8.7.1
  - Update mermaid from 9.1.7 to 9.4.3
  - Update Artalk from 2.3.4 to 2.5.2
- **Full Changelog:** @Lruihao [`v0.2.17...v0.2.18`](https://github.com/hugo-fixit/FixIt/compare/v0.2.17...v0.2.18)

## v0.2.17 [2023.1.29]

> Snapshot: <https://fixit-pcwilecsu-x-cell.vercel.app>

- :tada: Feat: add support for [Fusejs search](https://fusejs.io/) ([#203](https://github.com/hugo-fixit/FixIt/issues/203))
- :sparkles: Feat: add feature post reward support ([#216](https://github.com/hugo-fixit/FixIt/issues/216), @Lruihao[#234](https://github.com/hugo-fixit/FixIt/pull/234))
- :sparkles: Feat: add reward shortcode support ([#216](https://github.com/hugo-fixit/FixIt/issues/216))
- :sparkles: Feat: add TagCloud config support for tags page, see parameter `params.tagcloud` ([#235](https://github.com/hugo-fixit/FixIt/issues/235))
- :sparkles: Feat: add [pace](https://github.com/CodeByZach/pace) support ([#190](https://github.com/hugo-fixit/FixIt/issues/190))
- :sparkles: Feat: add custom templates and parameter `params.customFilePath` support
- :sparkles: Feat: add feature end of post flag support ([#236](https://github.com/hugo-fixit/FixIt/issues/236))
- :sparkles: Feat: refactor parameter `params.footer.siteTime`
- :sparkles: Feat: add params to close wordcount and readingTime in post ([#209](https://github.com/hugo-fixit/FixIt/issues/209))
- :sparkles: Feat: add parameter `params.footer.order` to order footer lines
- :sparkles: Feat: add parameter `params.home.profile.avatarMenu`
- :truck: Feat: migrate parameter `params.autoBookmark` to `params.page.autoBookmark` ([#55](https://github.com/hugo-fixit/FixIt/issues/55))
- :truck: Feat: move `assets/data/emoji` to `assets/lib/valine/emoji/`
- :zap: Perf: optimize close comment feature when the post has expired ([#204](https://github.com/hugo-fixit/FixIt/issues/204))
- :zap: Perf: optimize sub menu position calculation in desktop header with css replace of javascript
- :zap: Perf: enhance pangu spelling correction
- :bug: Fix: remove the leading and trailing whitespace of the code string ([#205](https://github.com/hugo-fixit/FixIt/issues/205))
- :bento: Fix: update webfonts for fontawesome 6.2.0 (@NicoDreamzZ [#228](https://github.com/hugo-fixit/FixIt/pull/228))
- :bug: Fix: image shortcode/plugin lose the support for svg type files ([#210](https://github.com/hugo-fixit/FixIt/issues/210))
- :bug: Fix: can't keep the static table of the contents in front of the post
- :bug: Fix: escape hashtag character `#` in tag and category ([#245](https://github.com/hugo-fixit/FixIt/issues/245))
- :bug: Fix: pangu.js cdn error
- :bug: Fix: sitemap.xml link in robots.txt doesn't point to main sitemap (@Mejituu [#276](https://github.com/hugo-fixit/FixIt/pull/276))
- :recycle: Refactor(i18n): hierarchize translation fields for supported languages
- :globe_with_meridians: Docs(i18n): add missing translations for French + enhancements (@Kapusch [#247](https://github.com/hugo-fixit/FixIt/pull/247))
- :lipstick: Style: refactor css style
- :lipstick: Style: update home page stylesheet
- :arrow_up: Chore(libs):
  - Update Twikoo from 1.4.10 to 1.6.8 and add Katex support for it ([#215](https://github.com/hugo-fixit/FixIt/issues/215) [#243](https://github.com/hugo-fixit/FixIt/issues/243))
- :wrench: Chore(deps-dev):
  - Bump @babel/cli from 7.18.10 to 7.20.7
  - Bump @babel/core from 7.19.1 to 7.20.12
  - Bump @babel/preset-env from 7.18.10 to 7.20.2
  - Bump core-js from 3.25.2 to 3.27.2
- :wrench: Chore(deps-dev):
  - Bump @babel/cli from 7.20.7 to 7.17.10
  - Bump @babel/core from 7.20.12 to 7.21.4
  - Bump @babel/preset-env from 7.20.2 to 7.21.4
  - Bump core-js from 3.27.2 to 3.29.1
- **Full Changelog:** @Lruihao [`v0.2.16...v0.2.17`](https://github.com/hugo-fixit/FixIt/compare/v0.2.16...v0.2.17)

## v0.2.16 [2022.9.24]

> This version fixes several bugs, adds a few new features and SEO optimizations, and refactors part of the project structure and code.  
> Snapshot: <https://fixit-jir7e7kzt-x-cell.vercel.app>

- :tada: Feat: add reading progress bar support ([#191](https://github.com/hugo-fixit/FixIt/issues/191))
- :tada: Feat: add b2t scroll percent support ([#192](https://github.com/hugo-fixit/FixIt/issues/192))
- :sparkles: Feat: add auto bookmark support ([#55](https://github.com/hugo-fixit/FixIt/issues/55))
- :sparkles: Feat: add `raw` shortcode
- :sparkles: Feat(menu): add params: `icon`, `type` for menu items
- :sparkles: Feat: add custom aside template in post page ([#172](https://github.com/hugo-fixit/FixIt/issues/172))
- :sparkles: Feat(math): add more block delimiter support for math
- :sparkles: Feat(highlight): add full support for Chroma highlighting languages in the [list](https://gohugo.io/content-management/syntax-highlighting/#list-of-chroma-highlighting-languages)
- :sparkles: Feat: add optional parameter `noreferrer` for the shortcode `link`
- :sparkles: Feat: update echarts theme config
- :sparkles: Feat: add noscript warning banner ([#194](https://github.com/hugo-fixit/FixIt/issues/194))
- :sparkles: Feat: add 12 newly supported social links ([#175](https://github.com/hugo-fixit/FixIt/issues/175) [#197](https://github.com/hugo-fixit/FixIt/issues/197))
- :zap: Perf: remove extra spaces in plugin link
- :wheelchair: Feat(accessibility): use `aria-hidden=true` on icons that AT should ignore
- :recycle: Refactor: image rendering
- :recycle: Refactor: back to top and scroll to comments
- :recycle: Refactor: custom.js rendering and remove `params.customJS` ([#189](https://github.com/hugo-fixit/FixIt/pull/189))
- :recycle: Refactor: scss directory ([#185](https://github.com/hugo-fixit/FixIt/issues/185))
- :recycle: Refactor: plugin script
- :recycle: Refactor: version.template.svg
- :recycle: Refactor: config ([#187](https://github.com/hugo-fixit/FixIt/issues/187))
- :bug: Fix: add function `dos2unix` to unify new lines symbol between Windows and Unix/Mac OS
- :bug: Fix: author display error in post and markdown file
- :bug: Fix: use data attributes or class replace for custom attributes
- :bug: Fix: attribute `media` not allowed on element meta in `[name=theme-color]`
- :bug: Fix: support smooth migration from LoveIt to FixIt ([#174](https://github.com/hugo-fixit/FixIt/discussions/174) [#182](https://github.com/hugo-fixit/FixIt/issues/182))
- :bug: Fix: `center-quote` shortcode rendering error when config `unsafe = false` (@yureiita [#160](https://github.com/hugo-fixit/FixIt/pull/160))
- :bug: Fix: menu item invalid params `draft` in submenu
- :bug: Fix: missing height and weight of img element and lazyload object-fit style
- :bug: Fix: image shortcode invalid params `height` and `weight` ([#200](https://github.com/hugo-fixit/FixIt/issues/200))
- :bug: Fix: typeit shortcode invalid config `duration = -1` and fix style
- :bug: Fix: typeit shortcode prints consecutive spaces and newline errors
- :art: Style: change the default icons of some social links
- :bug: Fix: component `paginator` style error ([#188](https://github.com/hugo-fixit/FixIt/issues/188))
- :lipstick: Style: fix language and theme switch cursor style ([#193](https://github.com/hugo-fixit/FixIt/issues/193))
- :lipstick: Style: change line-break style of code element from `anywhere` to `auto`
- :globe_with_meridians: Docs(i18n): update pt-br, de in i18n
- :mag: Perf(SEO): enhance SEO performance
- :wrench: Chore: modify babel config and optimize theme.js compilation and loading (revert [`65371a1`](https://github.com/hugo-fixit/FixIt/commit/65371a19a40591c3f403f7fde2b7001c3390354d))
- :wrench: Chore: creating new go.mod: module github.com/hugo-fixit/FixIt
- :arrow_up: Chore(libs):
  - Update simple-icons from 6.3.0 to 7.12.0
  - Update emoji-data from 5.0.1 to 14.0.0
  - Update mermaid from 9.1.3 to 9.1.7
  - Update typeit from 7.0.4 to 8.7.0
  - Update lightgallery from 1.4.0 to 2.6.1
  - Update Valine from 1.5.0 to 1.5.1
  - Update @waline/client from 2.6.1 to 2.10.0
  - Update mapbox-gl from 2.8.2 to 2.10.0
  - Update fontawesome-free from 6.1.1 to 6.2.0
  - Update katex from 0.15.3 to 0.16.2
  - Update echarts from 5.2.2 to 5.3.3
  - Update algoliasearch from 4.13.0 to 4.14.2
- :wrench: Chore(deps-dev):
  - Remove dependencies: minimist, babel-preset-minify
  - Bump core-js from 3.24.1 to 3.25.2 (@dependabot [#201](https://github.com/hugo-fixit/FixIt/pull/201))
  - Bump @babel/core from 7.18.10 to 7.19.1 (@dependabot [#202](https://github.com/hugo-fixit/FixIt/pull/202))
- **Full Changelog:** @Lruihao [`v0.2.15...v0.2.16`](https://github.com/hugo-fixit/FixIt/compare/v0.2.15...v0.2.16)

## v0.2.15 [2022.8.4]

> Add content encryption feature(pages, partial), total word count, enhance auto toc, developer options and more.  
> Snapshot: <https://fixit-hvd1rg4ba-x-cell.vercel.app>

- :truck: Feat: ransfer repository from Lruihao to hugo-fixit
- :tada: Feat: add content encryption of pages ([#123](https://github.com/hugo-fixit/FixIt/issues/123))
- :tada: Feat: add `fixit-encryptor` shortcode ([#123](https://github.com/hugo-fixit/FixIt/issues/123))
- :sparkles: Feat: add total word count feature in section and remove from footer ([#124](https://github.com/hugo-fixit/FixIt/issues/124))
- :sparkles: Feat: enhance auto toc feature ([#104](https://github.com/hugo-fixit/FixIt/issues/104) [#136](https://github.com/hugo-fixit/FixIt/issues/136))
- :sparkles: Feat: add repost feature ([#156](https://github.com/hugo-fixit/FixIt/issues/156))
- :sparkles: Feat: add developer options
  - Check for updates option
  - Mobile Devtools config ([#163](https://github.com/hugo-fixit/FixIt/pull/163))
- :bug: Fix: unable to show search bar of header at mobile mode ([#143](https://github.com/hugo-fixit/FixIt/issues/143))
- :bug: Fix: Giscus comment invalid config `inputPosition`
- :bug: Fix: Waline comment invalid config `imageUploader = false` & `highlighter = false` (@yureiita [#161](https://github.com/hugo-fixit/FixIt/pull/161))
- :bug: Fix: busuanzi logic error
- :bug: Fix: close comment system logic error when the article was expired
- :bug: Style: fix typos for rel attribute value noreferrer (@yureiita [#157](https://github.com/hugo-fixit/FixIt/pull/157))
- :recycle: Refactor: migrate theme js from src to assets by js.build
- :recycle: Refactor: change the post edit url splicing rules
- :mag: Feat(SEO): add options to make output `baidu_urls.txt` file ([#138](https://github.com/hugo-fixit/FixIt/issues/138))
- :truck: Feat: migrate exampleSite to docs submodule
- :art: Style: add theme colors variables and add common color styles
- :art: Style: add scroll bar for auto toc ([#136](https://github.com/hugo-fixit/FixIt/issues/136))
- :art: Style: change the version badge style form flat-square to flat
- :memo: Docs: revise theme documentations
- :heavy_plus_sign: Feat: add theme core configuration settings file
- :wrench: Feat(cdn): add unpkg cdn support
- :wrench: Chore: change the theme minimum supported Hugo versions above **0.84.0**
- :arrow_up: Chore(libs): update some third-party libraries
  - Update Artalk from 2.2.12 to 2.3.4 ([#150](https://github.com/hugo-fixit/FixIt/issues/150))
  - Update Waline from 1.5.2 to 2.6.1
  - Update Valine from 1.4.18 to 1.5.0
  - Update mermaid from 8.13.3 to 9.1.3
- :arrow_up: Chore(deps-dev):
  - Bump babel-preset-minify from 0.5.1 to 0.5.2 ([#145](https://github.com/hugo-fixit/FixIt/pull/145))
  - Bump core-js from 3.22.0 to 3.24.1 ([#168](https://github.com/hugo-fixit/FixIt/pull/168))
  - Bump @babel/preset-env from 7.16.11 to 7.18.10 ([#169](https://github.com/hugo-fixit/FixIt/pull/169))
  - Bump @babel/cli from 7.17.6 to 7.18.10 ([#170](https://github.com/hugo-fixit/FixIt/pull/170))
  - Bump @babel/core from 7.17.9 to 7.18.10 ([#171](https://github.com/hugo-fixit/FixIt/pull/171))
- **Full Changelog:** @Lruihao [`v0.2.14...v0.2.15`](https://github.com/hugo-fixit/FixIt/compare/v0.2.14...v0.2.15)

## v0.2.14 [2022.5.15]

> Add hugo new features support.  
> Snapshot: <https://fixit-p1tg6tsml-lruihao.vercel.app>

- :recycle: Refactor: header layout
  - :tada: Feat: add sub menu (nested menu) support ([#31](https://github.com/hugo-fixit/FixIt/issues/31))
  - :sparkles: Feat: add user-defined content to menu items via the `params` field ([#99](https://github.com/hugo-fixit/FixIt/issues/99))
  - :sparkles: Feat: modified language selector to submenu (@pandaoh [`eced169`](https://github.com/hugo-fixit/FixIt/commit/eced169713ce4a0208ce70ab556824e47eb671d5), @Lruihao [#31](https://github.com/hugo-fixit/FixIt/issues/31))
  - :bug: Fix: add "no more translations" judgment logic ([#100](https://github.com/hugo-fixit/FixIt/issues/100))
  - :bug: Fix: fix some header css bug ([#31](https://github.com/hugo-fixit/FixIt/issues/31))
- :sparkles: Feat: enhance link render ([#96](https://github.com/hugo-fixit/FixIt/issues/96))
  - Add external icon for external links automatically
  - Add download icon for downloadable links
- :sparkles: Feat: add giscus comment system ([#130](https://github.com/hugo-fixit/FixIt/issues/130))
- :sparkles: Feat: link shortcode add `external-icon` option ([#96](https://github.com/hugo-fixit/FixIt/issues/96))
- :sparkles: Feat: add GitHub Corners support ([#106](https://github.com/hugo-fixit/FixIt/issues/106))
- :sparkles: Feat: add local avatar and gravatar support for post author ([#125](https://github.com/hugo-fixit/FixIt/issues/125))
- :sparkles: Feat: add ~~total word count support in footer~~ ([#124](https://github.com/hugo-fixit/FixIt/issues/124))
- :sparkles: Feat: add "Edit this page" button support ([#103](https://github.com/hugo-fixit/FixIt/issues/103))
- :sparkles: Feat: add count badge for taxonomy ([#122](https://github.com/hugo-fixit/FixIt/issues/122))
- :zap: Perf: add Gravatar config support
- :bug: Fix: invalid front matter `comment: true` ([#108](https://github.com/hugo-fixit/FixIt/issues/108))
- :bug: Fix: ibruce and watermark option negative value error ([#114](https://github.com/hugo-fixit/FixIt/issues/114))
- :truck: Feat: *migrate ~~`home.profile.gravatarSite`~~ to `gravatar.host`*
- :truck: Feat: *migrate ~~`ibruce.siteTime`~~ to `footer.siteTime`*
- :lipstick: Style: add some common CSS styles Class ([#101](https://github.com/hugo-fixit/FixIt/issues/101))
- :lipstick: Style: add the gap between and icon and text at blending typesetting (@ctj12461 @Lruihao [#118](https://github.com/hugo-fixit/FixIt/pull/118))
- :lipstick: Style: modify blockquote CSS
- :memo: Docs: revise theme documentations
- :zap: Perf: remove third-party library clipboard.js ([#84](https://github.com/hugo-fixit/FixIt/issues/84))
- :pencil2: Docs: fix highlight url typo in `theme-documentation-built-in-shortcodes` (@d-baer [#85](https://github.com/hugo-fixit/FixIt/pull/85))
- :wrench: Chore(i18n): improve translations for the supported languages ([#119](https://github.com/hugo-fixit/FixIt/issues/119))
- :wrench: Chore(i18n): add i18n support for console messages
- :wrench: Chore: add deprecated parameter detection in cli
- :arrow_up: Chore: update some third-party libraries
- :wrench: Chore(deps-dev):
  - Bump minimist from 1.2.5 to 1.2.6 ([#92](https://github.com/hugo-fixit/FixIt/pull/92))
  - Bump @babel/core from 7.17.5 to 7.17.10 ([#126](https://github.com/hugo-fixit/FixIt/pull/126))
  - Bump core-js from 3.21.1 to 3.22.5 ([#129](https://github.com/hugo-fixit/FixIt/pull/129))
  - Bump @babel/cli from 7.17.6 to 7.17.10 ([#127](https://github.com/hugo-fixit/FixIt/pull/127))
  - Bump @babel/preset-env from 7.16.11 to 7.17.10 ([`bc74d14`](https://github.com/hugo-fixit/FixIt/commit/bc74d149c16b36644fecdd5bef325bf8087f8593))
- **Full Changelog:** @Lruihao [`v0.2.13...v0.2.14`](https://github.com/hugo-fixit/FixIt/compare/v0.2.13...v0.2.14)

## v0.2.13 [2022.3.14]

> Improve and add some new features.  
> Snapshot: <https://fixit-bbh5g5x90-lruihao.vercel.app>

- :recycle: Refactor: page layout ([#65](https://github.com/hugo-fixit/FixIt/issues/65))
- :tada: Feat: add Artalk comment support ([#54](https://github.com/hugo-fixit/FixIt/issues/54), @hiifong [#57](https://github.com/hugo-fixit/FixIt/pull/57))
- :tada: Feat: add Waline comment support ([#36](https://github.com/hugo-fixit/FixIt/issues/36))
- :tada: Feat: add Twikoo comment support ([#64](https://github.com/hugo-fixit/FixIt/issues/64))
- :sparkles: Feat: add recently updated section ([#50](https://github.com/hugo-fixit/FixIt/issues/50))
- :sparkles: Feat: add article expiration reminder support ([#51](https://github.com/hugo-fixit/FixIt/issues/51))
- :sparkles: Feat: add pageStyle option ([#62](https://github.com/hugo-fixit/FixIt/issues/62))
- :sparkles: Style: add media style for print view ([#61](https://github.com/hugo-fixit/FixIt/issues/61))
- :sparkles: Feat: add Gravatar mirror site support (@ctj12461 [#66](https://github.com/hugo-fixit/FixIt/pull/66))
- :sparkles: Feat: add archive count display ([#33](https://github.com/hugo-fixit/FixIt/issues/33))
- :sparkles: Feat: add `details` shortcode ([#68](https://github.com/hugo-fixit/FixIt/issues/68))
- :sparkles: Feat: add `center-quote` shortcode ([#69](https://github.com/hugo-fixit/FixIt/issues/69))
- :sparkles: Feat: add markdown support for **title** parameter of the admonition shortcode
- :sparkles: Feat: add 9 newly supported social links ([#17](https://github.com/hugo-fixit/FixIt/issues/17))
- :zap: Perf: enhance highlight feature (GitHub syntax supported) and fix some css bugs ([#43](https://github.com/hugo-fixit/FixIt/issues/43))
  - Inline Code
  - Indented Code
  - Block Fenced Code
  - gist shortcode
- :sparkles: Feat: add `params.page.code.edit` option support ([#76](https://github.com/hugo-fixit/FixIt/issues/76))
- :mag: Feat: add 360 and sougou seo support
- :bug: Fix: remove source map of local libraries to avoid 404 error ([#67](https://github.com/hugo-fixit/FixIt/issues/67))
- :fire: Feat: remove shortcode cardlink ([#42](https://github.com/hugo-fixit/FixIt/issues/42))
- :lipstick: Style: more refined theme style ([#40](https://github.com/hugo-fixit/FixIt/issues/40))
- :pencil2: Style: fix typo *discription* should be **description** ([#60](https://github.com/hugo-fixit/FixIt/issues/60))
- :wrench: Chore(update-libs):
  - Update cell-watermark 1.0.3 and CDN support (fontFamily supported)
  - Update animate.css 3.7.2 -> 4.1.1 ([#74](https://github.com/hugo-fixit/FixIt/issues/74))
- :wrench: Chore: add atomic-algolia for exampleSite ([#70](https://github.com/hugo-fixit/FixIt/issues/70))
- **Full Changelog:** @Lruihao [`v0.2.12...v0.2.13`](https://github.com/hugo-fixit/FixIt/compare/v0.2.12...v0.2.13)

## v0.2.12 [2022-1-27]

> Fix most known bugs and add some new features.  
> Snapshot: <https://fixit-e9lpwfkbp-lruihao.vercel.app>

- :tada: Feat: add PWA support
- :tada: Feat: add Watermark support ([#16](https://github.com/hugo-fixit/FixIt/issues/16))
- :tada: Feat: add "不蒜子" count and site run time ([#18](https://github.com/hugo-fixit/FixIt/issues/18))
- :sparkles: Feat: add pangu.js support ([#20](https://github.com/hugo-fixit/FixIt/issues/20))
- :sparkles: Feat: add public network security config (only in China) ([#15](https://github.com/hugo-fixit/FixIt/issues/15))
- :sparkles: Feat: add CustomJS option ([#24](https://github.com/hugo-fixit/FixIt/issues/24))
- :sparkles: Feat: add theme embedded archeTypes
- :mag: Feat(SEO): optimize SEO meta ([#30](https://github.com/hugo-fixit/FixIt/issues/30))
- :zap: Feat: remove lib smooth-scroll ([#1](https://github.com/hugo-fixit/FixIt/issues/1)) replaced by CSS native properties scroll-margin, scroll-behavior ([#39](https://github.com/hugo-fixit/FixIt/issues/39))
- :zap: Perf: merge shortcode cardlink (deprecated v0.2.13) into shortcode link and add 'download' param ([#42](https://github.com/hugo-fixit/FixIt/issues/42))
- :zap: Perf: optimize JS loading ([#25](https://github.com/hugo-fixit/FixIt/issues/25))
- :recycle: Refactor: header title DOM and add subtitle option ([#26](https://github.com/hugo-fixit/FixIt/issues/26))
- :bug: Fix: set mermaid theme as 'default' when initialization ([#38](https://github.com/hugo-fixit/FixIt/issues/38))
- :bug: Fix: typeit print code error ([#19](https://github.com/hugo-fixit/FixIt/issues/19))
- :bug: Fix: pre element overflow error ([#29](https://github.com/hugo-fixit/FixIt/issues/29))
- :bug: Fix: toc display error without content header ([#21](https://github.com/hugo-fixit/FixIt/issues/21))
- :lipstick: Style: style detail adjustments, change scroll-behavior to smooth, taxonomy, header, footer, shortcode style etc.
- :pencil: Docs: improve demo site documentation ([#37](https://github.com/hugo-fixit/FixIt/issues/37))
- :wrench: Chore: add commands `fixit_checker.sh`
- :wrench: Chore(i18n): change some translations
- :arrow_up: Chore: update all third-party libraries
- **Full Changelog:** @Lruihao [`v0.2.11...v0.2.12`](https://github.com/hugo-fixit/FixIt/compare/v0.2.11...v0.2.12)

## v0.2.11 [2021-12-19]

> :tada: The beginning of FixIt to fix the theme LoveIt.

- :sparkles: Feat: add cardlink shortcode ([Lruihao/hugo-blog@`df9eca2`](https://github.com/Lruihao/hugo-blog/commit/df9eca26af43287748fd8d4654014357a8269b0b))
- :tada: Feat: add friends layout template
- :wrench: Chore(i18n): add translations for Traditional Chinese ([Lruihao/hugo-blog@`df9eca2`](https://github.com/Lruihao/hugo-blog/commit/b86157d8b84830bda415ab2488580afd843acac2))
- :bug: Fix: mobile style ([Lruihao/hugo-blog#19](https://github.com/Lruihao/hugo-blog/issues/19))
- :bug: Style: fix content h1 style ([Lruihao/hugo-blog#8](https://github.com/Lruihao/hugo-blog/issues/8))
- :bug: Fix: `.params.author` should be `$params.author`  ([Lruihao/hugo-blog#1](https://github.com/Lruihao/hugo-blog/issues/1))
- **Full Changelog:** @Lruihao [`v0.2.10...v0.2.11`](https://github.com/hugo-fixit/FixIt/compare/v0.2.10...v0.2.11)

## v0.2.10 :arrow_down: [2020-5-29 before]

Thanks [dillonzq/LoveIt](https://github.com/dillonzq/LoveIt/releases)
