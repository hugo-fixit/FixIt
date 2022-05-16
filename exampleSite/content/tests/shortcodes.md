---
title: "Shortcodes Test"
date: 2022-03-07T22:31:22+08:00
description: "Test for shortcodes usages"
type: 'posts'
draft: true

tags:
- Test
- shortcodes
categories:
- Test

menu:
  main:
    title: "Test for shortcodes usages"
    parent: "tests"
    pre: "<i class='fa-solid fa-vial fa-fw fa-sm'></i>"
---

normal content

> normal blockquote content

## Shortcodes without Markdown

{{< center-quote >}}
**hello** *world*  
this is a center-quote shortcode example.
{{< /center-quote >}}

## Shortcodes with Markdown

{{% center-quote %}}
**hello** *world*  
this is a center-quote shortcode example.
{{% /center-quote %}}

{{< details "**Copyright** 2022. [Lruihao](https://lruihao.cn/)" >}}
*All pages and graphics on this web site are the property of [FixIt](/).*
{{< /details >}}

{{< admonition type=tip title="*This is a tip*" open=false >}}
A **tip** banner
{{< /admonition >}}

## Shortcodes with raw string parameters

{{< details `<b>Copyright</b> 2022. <em>Lruihao</em>` >}}
*All pages and graphics on this web site are the property of [FixIt](/).*
{{< /details >}}

## Nested Shortcodes

{{< version 0.2.0 changed >}} {{< link "https://katex.org/" KaTeX >}} mathematical formulas (https://katex.org)

```
{{< version 0.2.0 changed >}} {{< link "https://katex.org/" KaTeX >}} mathematical formulas (https://katex.org)
```
