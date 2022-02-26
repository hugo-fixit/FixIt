# Changelog
All notable changes to this project will be documented in this file.
<!-- Releases see https://github.com/Lruihao/FixIt/releases -->

## v0.2.13

- :recycle: Refactor: page layout ([#65](https://github.com/Lruihao/FixIt/issues/65))
- :tada: Feat: add Artalk comment support ([#54](https://github.com/Lruihao/FixIt/issues/54), [#57](https://github.com/Lruihao/FixIt/pull/57)@hiifong)
- :tada: Feat: add Waline comment support ([#36](https://github.com/Lruihao/FixIt/issues/36))
- :tada: Feat: add Twikoo comment support ([#64](https://github.com/Lruihao/FixIt/issues/64))
- :sparkles: Feat: add recently updated section ([#50](https://github.com/Lruihao/FixIt/issues/50))
- :sparkles: Feat: add article expiration reminder support ([#51](https://github.com/Lruihao/FixIt/issues/51))
- :sparkles: Feat: add pageStyle option ([#62](https://github.com/Lruihao/FixIt/issues/62))
- :sparkles: Style: add media style for print view ([#61](https://github.com/Lruihao/FixIt/issues/61))
- :sparkles: Feat: add Gravatar mirror site support ([#66](https://github.com/Lruihao/FixIt/pull/66)@ctj12461)
- :sparkles: Feat: add archive count display ([#33](https://github.com/Lruihao/FixIt/issues/33))
- :sparkles: Feat: add details shortcode ([#68](https://github.com/Lruihao/FixIt/issues/68))
- :sparkles: Feat: add markdown support for **title** parameter of the admonition shortcode
- :sparkles: Feat: add 9 newly supported social links ([#17](https://github.com/Lruihao/FixIt/issues/17))
- :sparkles: Feat: update cell-watermark 1.0.3 and CDN support (fontFamily supported)
- :bug: Fix: remove source map of local libraries to avoid 404 error ([#67](https://github.com/Lruihao/FixIt/issues/67))
- :mag: Feat: add 360 and sougou seo support
- :lipstick: Style: add radius of the scrollbar
- :pencil2: Style: fix typo *discription* should be **description** ([#60](https://github.com/Lruihao/FixIt/issues/60))
- :fire: Feat: remove shortcode cardlink ([#42](https://github.com/Lruihao/FixIt/issues/42))
- **Full Changelog:** [`v0.2.12...v0.2.13`](https://github.com/Lruihao/FixIt/compare/v0.2.12...v0.2.13)

## v0.2.12 [2022-1-27]

- :tada: Feat: add PWA support
- :tada: Feat: add Watermark support ([#16](https://github.com/Lruihao/FixIt/issues/16))
- :tada: Feat: add "不蒜子" count and site run time ([#18](https://github.com/Lruihao/FixIt/issues/18))
- :sparkles: Feat: add pangu.js support ([#20](https://github.com/Lruihao/FixIt/issues/20))
- :sparkles: Feat: add public network security config (only in China) ([#15](https://github.com/Lruihao/FixIt/issues/15))
- :sparkles: Feat: add CustomJS option ([#24](https://github.com/Lruihao/FixIt/issues/24))
- :sparkles: Feat: add theme embedded archeTypes
- :mag: Feat(SEO): optimize SEO meta ([#30](https://github.com/Lruihao/FixIt/issues/30))
- :zap: Feat: remove lib smooth-scroll ([#1](https://github.com/Lruihao/FixIt/issues/1)) replaced by CSS native properties scroll-margin, scroll-behavior ([#39](https://github.com/Lruihao/FixIt/issues/39))
- :zap: Perf: merge shortcode cardlink (deprecated v0.2.13) into shortcode link and add 'download' param ([#42](https://github.com/Lruihao/FixIt/issues/42))
- :zap: Perf: optimize JS loading ([#25](https://github.com/Lruihao/FixIt/issues/25))
- :recycle: Refactor: header title DOM and add subtitle option ([#26](https://github.com/Lruihao/FixIt/issues/26))
- :bug: Fix: set mermaid theme as 'default' when initialization ([#38](https://github.com/Lruihao/FixIt/issues/38))
- :bug: Fix: typeit print code error ([#19](https://github.com/Lruihao/FixIt/issues/19))
- :bug: Fix: pre element overflow error ([#29](https://github.com/Lruihao/FixIt/issues/29))
- :bug: Fix: toc display error without content header ([#21](https://github.com/Lruihao/FixIt/issues/21))
- :lipstick: Style: style detail adjustments, change scroll-behavior to smooth, taxonomy, header, footer, shortcode style etc.
- :pencil: Docs: improve demo site documentation ([#37](https://github.com/Lruihao/FixIt/issues/37))
- :wrench: Chore: add commands `fixit_checker.sh`
- :wrench: Chore(i18n): change some translations
- :arrow_up: Chore: update all third-party libraries
- **Full Changelog:** [`v0.2.11...v0.2.12`](https://github.com/Lruihao/FixIt/compare/v0.2.11...v0.2.12)
## v0.2.11 [2021-12-19]

> :tada: The beginning of FixIt to fix the theme LoveIt.

- :sparkles: Feat: add cardlink shortcode ([Lruihao/hugo-blog@`df9eca2`](https://github.com/Lruihao/hugo-blog/commit/df9eca26af43287748fd8d4654014357a8269b0b)) 
- :tada: Feat: add friends layout template
- :wrench: Chore(i18n): add translations for Traditional Chinese ([Lruihao/hugo-blog@`df9eca2`](https://github.com/Lruihao/hugo-blog/commit/b86157d8b84830bda415ab2488580afd843acac2))
- :bug: Fix: mobile style ([Lruihao/hugo-blog#19](https://github.com/Lruihao/hugo-blog/issues/19))
- :bug: Style: fix content h1 style ([Lruihao/hugo-blog#8](https://github.com/Lruihao/hugo-blog/issues/8))
- :bug: Fix: `.params.author` should be `$params.author`  ([Lruihao/hugo-blog#1](https://github.com/Lruihao/hugo-blog/issues/1))
- **Full Changelog:** [`v0.2.10...v0.2.11`](https://github.com/Lruihao/FixIt/compare/v0.2.10...v0.2.11)

## v0.2.10 :arrow_down: [2020-5-29 before]

Thanks [dillonzq/LoveIt](https://github.com/dillonzq/LoveIt/releases)