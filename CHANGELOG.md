# Changelog

All notable changes to this project will be documented in this file.
<!-- Releases see https://github.com/hugo-fixit/FixIt/releases -->

## v1.0.0

> Snapshot: <>

- :sparkles: Feat: add code block attributes support ([#330](https://github.com/hugo-fixit/FixIt/issues/330))
- :sparkles: Feat: add options to cache remote image locally ([#362](https://github.com/hugo-fixit/FixIt/pull/362) Fixes [#348](https://github.com/hugo-fixit/FixIt/issues/348))
- :sparkles: Feat: change post nav rule at post footer
- :sparkles: Feat: add hiddenFromRss param and front matter
- :zap: Perf: optimize lightgallery images rendering
- :zap: Perf: preload some stylesheet
- :bug: Fix: use dateFormat function to render localized dates (@stefanoginobili [#355](https://github.com/hugo-fixit/FixIt/pull/355))
- :bug: Fix: total word count error in section
- :bug: Fix: fix path errors in image src and 1.5x srcset ([#346](https://github.com/hugo-fixit/FixIt/issues/346))
- :bug: Fix: fix toc active error when breadcrumb is enabled and set `sticky` to `true` ([#368](https://github.com/hugo-fixit/FixIt/issues/368))
- :bug: Fix: add a option "Responsive" for plugin image fixed [#369](https://github.com/hugo-fixit/FixIt/issues/369)
- :bug: Fix: fix featured image path error and show img tags in rss ([#373](https://github.com/hugo-fixit/FixIt/issues/373))
- :bug: Fix: disable encrypted articles from rendering to rss ([#374](https://github.com/hugo-fixit/FixIt/issues/374))
- :sparkles: Feat: add more options support for bilibili shortcode, e.g. `autoplay`, `muted` etc. ([#375](https://github.com/hugo-fixit/FixIt/issues/375))
- :bug: Style: fix the emoji style of valine comment ([#376](https://github.com/hugo-fixit/FixIt/issues/376))
- :bug: Fix: active index of toc may result in error ([#305](https://github.com/hugo-fixit/FixIt/issues/305))
- :lipstick: Style: update define list style
- :lipstick: Style: update footnote and footnote-ref style
- :memo: Docs: update the outputs configuration to avoid the "taxonomyterm" warning in versions above Hugo 0.112.0 (resolve [#354](https://github.com/hugo-fixit/FixIt/issues/354))
- :wrench: Chore: update default config in `hugo.toml`
- :wrench: Chore: change the theme minimum supported Hugo versions above **0.110.0**
- :arrow_up: Chore(libs):
  - Update algoliasearch from 4.14.2 to 4.20.0
  - Update Artalk from 2.5.2 to 2.6.4
  - Update fontawesome-free from 6.2.0 to 6.4.2
  - Update instant.page from 5.1.1 to 5.2.0
  - Update katex from 0.16.2 to 0.16.9
  - Update lightgallery from 2.6.1 to 2.7.2
  - Removed Renren, Digg and StumbleUpon in sharer.js 0.5.0
  - Update Twikoo from 1.6.8 to 1.6.22
  - Update vConsole from 3.14.6 to 3.15.1
  - Update eruda from 2.5.0 to 3.0.1
  - Update Waline from 2.14.7 to 2.15.8
  - Update simple-icons from 7.12.0 to 9.19.0
- **Full Changelog:** @Lruihao [`v0.2.18...v1.0.0`](https://github.com/hugo-fixit/FixIt/compare/v0.2.18...v1.0.0)
