---
title: Link Rendering Test
date: 2026-04-10T11:40:06+08:00
collections:
  - Tests
categories:
  - Markdown
tags:
  - Link
---


This post validates link rendering paths in FixIt, including Markdown render hook and link shortcode modes.

<!--more-->

## Markdown Render Hook (Regular Link)

These links are rendered by `layouts/_markup/render-link.html` and should always produce regular links.

- Internal relative link: [Task list test](/test/units/task-list-test/)
- Internal anchor link: [Jump to Card Link section](#card-link-shortcode)
- Absolute same-site link: [Test site home](http://demo.fixit.lruihao.cn/test/)
- External HTTP link: [FixIt Repository](https://github.com/hugo-fixit/FixIt)
- Mail link: [Email test](mailto:test@example.com)
- JavaScript link: [JavaScript test](javascript:void(0))
- Tel link: [Phone test](tel:+1234567890)
- File link: [File test](file:///path/to/file.txt)
- Data link: [Data URI test](data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==)

### Title Attribute (Markdown)

[External link with title](https://example.com "Example Title")

## Link Shortcode (Regular)

### Named parameters

{{< link href="https://github.com/hugo-fixit/FixIt" content="GitHub via shortcode" title="GitHub title" >}}

{{< link href="/test/units/codeblock-test/" content="Internal shortcode link" class="shortcode-link-test" >}}

{{< link href="https://example.com" content="Custom rel + no noreferrer" rel="ugc" noreferrer=false >}}

{{< link href="/images/fixit.svg" content="Download local file" download="fixit.svg" >}}

### Positional parameters

{{< link "https://example.org" "Positional regular link" "Positional title" >}}

## Card Link Shortcode

### Basic card

{{< link href="https://fixit.lruihao.cn" content="FixIt Documentation" card=true >}}

### Card with custom icon class

{{< link href="https://github.com/hugo-fixit/FixIt" content="FixIt on GitHub" card=true card-icon="fa-brands fa-github" >}}

### Card with custom image icon

{{< link href="https://gohugo.io" content="Hugo Official Site" card=true card-icon="/test/images/hugo.min.svg" >}}

### Card with download state

{{< link href="/images/fixit.svg" content="Download as card" card=true download="fixit.svg" >}}

### Positional card parameters

{{< link "https://example.com" "Positional card link" "" true "fa-solid fa-link" >}}

## Edge Cases

- URL with query string:
  [Search query test](https://example.com/search?q=fixit&lang=en)
- URL with fragment:
  [Fragment test](https://example.com/docs#installation)
- Long URL display (card meta should trim protocol automatically):
  {{< link href="https://example.com/a/very/long/path/for/testing/card/url/display?foo=bar&baz=qux" content="Long URL card" card=true >}}

## Manual Verification Checklist

- Regular Markdown external links include external behavior and icon policy.
- Internal links are not treated as external.
- Shortcode card links render `.card-link` structure and card meta URL.
- `download` shows download icon/state in both regular and card modes.
- `noreferrer=false` removes `noopener noreferrer` from generated rel values.
