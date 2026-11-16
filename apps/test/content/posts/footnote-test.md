---
title: Footnote Rendering Test
date: 2026-11-16T03:04:55+08:00
collections:
  - Tests
categories:
  - Markdown
tags:
  - Footnote
---

This post tests footnote rendering, tooltip interaction, and reference navigation.

<!--more-->

## Basic Footnotes

A sentence with a single footnote.[^basic] A sentence with a second footnote.[^second]

Numbering follows the order of first reference rather than definition order, so this footnote is numbered after the two above,[^order] even though its definition appears first in the source.

[^order]: This definition appears first in the source but is referenced last.
[^basic]: The first basic footnote.
[^second]: The second basic footnote.

## Multiple References to One Footnote

The same footnote may be referenced several times.[^repeat] Additional references get IDs such as `fnref1:1` and `fnref2:1`, and the footnote item gets one back-reference per citation.[^repeat] All three references should show the same tooltip and jump to the same footnote item.[^repeat]

[^repeat]: A footnote referenced three times.

## Rich Inline Content

Footnote content can contain **bold**, _italic_, `inline code`, ~~deleted text~~, and [links](https://fixit.lruihao.cn/).[^inline]

[^inline]: Content with **bold**, _italic_, `inline code`, ~~deleted text~~, and [a link to the FixIt website](https://fixit.lruihao.cn/). The tooltip should render all of it as HTML, not plain text.

## Multiple Blocks

A footnote may contain several block elements; the tooltip should keep the markup and drop only the back-reference links.[^blocks]

[^blocks]: First paragraph of the footnote.

    - A list item
    - Another list item with `inline code`

    > A blockquote inside the footnote.

    ```js
    console.log('code block inside a footnote')
    ```

    Final paragraph with [a link to the Hugo documentation](https://gohugo.io/) after the block elements.

## Long Content

Long footnote content should wrap inside the tooltip instead of overflowing the page.[^long] The tooltip stays open while the pointer moves into it, so links inside long footnotes remain clickable.[^long]

[^long]: This footnote is intentionally long to exercise tooltip sizing and wrapping. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 这是一段较长的中文内容，用于检查 Tooltip 的最大宽度、自动换行以及中英文混排时的折行表现。链接 [FixIt](https://fixit.lruihao.cn/) 位于脚注末尾，将指针移入 Tooltip 后应当仍可点击。

## Footnotes in Different Contexts

- A list item with a footnote.[^in-list]
- A list item without a footnote.

> A blockquote with a footnote.[^in-quote]

| Column | Description                               |
| ------ | ----------------------------------------- |
| Cell   | A table cell with a footnote.[^in-table]  |

[^in-list]: Footnote referenced from a list item.
[^in-quote]: Footnote referenced from a blockquote.
[^in-table]: Footnote referenced from a table cell.

## Non-ASCII Content

English and 中文可以出现在同一个脚注中。[^cjk-mixed] 纯中文脚注的标点和换行也应正常显示。[^cjk]

[^cjk-mixed]: Mixed English and 中文 with `代码` and **粗体**.
[^cjk]: 这是一个包含中文、English、数字 12345 和全角标点（，。！？）的脚注，用于检查 Tooltip 的换行与字体渲染。

## Edge Cases

**Adjacent references:** two markers back to back.[^adjacent-a] [^adjacent-b]

**Labels with hyphens:** a footnote label may contain hyphens.[^hyphen-label]

**Undefined reference:** the marker below is not defined and should render as literal text: [^undefined]

**Unused definition:** the definition at the bottom is never referenced and should be silently dropped.

[^adjacent-a]: First of two adjacent footnotes.
[^adjacent-b]: Second of two adjacent footnotes.
[^hyphen-label]: A footnote whose label contains hyphens.

## Verification Checklist

- Hovering a reference shows a tooltip with the rendered footnote HTML (no back-reference arrows).
- Moving the pointer into the tooltip keeps it open, and links inside it are clickable.
- Clicking a reference jumps to the footnote item at the end of the post.
- Clicking a back-reference returns to the matching reference; a footnote cited three times has three back-references.
- With `params.tooltip = false`, references fall back to the native plain-text `title` tooltip.
