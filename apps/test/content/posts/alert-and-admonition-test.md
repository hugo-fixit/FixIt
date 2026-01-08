---
title: Alerts and Admonition Syntax Test
date: 2025-09-05T16:57:58+08:00
collections:
  - Tests
categories:
  - Markdown
  - Shortcodes
tags:
  - Alerts
  - Admonition
---

This article comprehensively tests the **Alerts** Markdown syntax extension and **Admonition** shortcode functionality in the FixIt theme.

<!--more-->

## Basic Alerts Syntax

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

## Extended Alerts Syntax

### Custom Titles

> [!NOTE] FixIt
> A clean, elegant but advanced Hugo theme.

> [!TIP] This is a title-only alert

### Foldable Alerts

Create foldable alerts by adding a plus (+) or minus (-) directly after the type identifier:

> [!WARNING]+ Radiation Hazard
> Do not approach or handle without protective gear.

> [!QUESTION]- Are alerts foldable?
> Yes! In a foldable alert, the contents are hidden when collapsed.

### Nested Alerts

Alerts can be nested in multiple levels:

> [!question] Can alerts be nested?
> > [!todo] Yes! They can be nested.
> > > [!example] You can even use multiple layers of nesting.

### Content-only Alerts

> [!TIP]~
> This is a content-only alert without a title.

### Supported types

> [!note]+
> This is a note type alert example.

> [!abstract]-
> This is an abstract type alert example. Aliases: `summary`, `tldr`

> [!info]-
> This is an info type alert example.

> [!todo]-
> This is a todo type alert example.

> [!tip]-
> This is a tip type alert example. Aliases: `hint`, `important`

> [!success]-
> This is a success type alert example. Aliases: `check`, `done`

> [!question]-
> This is a question type alert example. Aliases: `help`, `faq`

> [!warning]-
> This is a warning type alert example. Aliases: `caution`, `attention`

> [!failure]-
> This is a failure type alert example. Aliases: `fail`, `missing`

> [!danger]-
> This is a danger type alert example. Aliases: `error`

> [!bug]-
> This is a bug type alert example.

> [!example]-
> This is an example type alert example.

> [!quote]-
> This is a quote type alert example. Aliases: `cite`

## Admonition Shortcode

{{< admonition >}}
This is the default note type admonition.
{{< /admonition >}}

{{< admonition abstract "" false  >}}
This is the default abstract type admonition. Aliases: `summary`, `tldr`
{{< /admonition >}}

{{< admonition info "" false >}}
This is the default info type admonition.
{{< /admonition >}}

{{< admonition todo "" false >}}
This is the default todo type admonition.
{{< /admonition >}}

{{< admonition tip "" false >}}
This is the default tip type admonition. Aliases: `hint`, `important`
{{< /admonition >}}

{{< admonition success "" false >}}
This is the default success type admonition. Aliases: `check`, `done`
{{< /admonition >}}

{{< admonition question "" false >}}
This is the default question type admonition. Aliases: `help`, `faq`
{{< /admonition >}}

{{< admonition warning "" false >}}
This is the default warning type admonition. Aliases: `caution`, `attention`
{{< /admonition >}}

{{< admonition failure "" false >}}
This is the default failure type admonition. Aliases: `fail`, `missing`
{{< /admonition >}}

{{< admonition danger "" false >}}
This is the default danger type admonition. Aliases: `error`
{{< /admonition >}}

{{< admonition bug "" false >}}
This is the default bug type admonition.
{{< /admonition >}}

{{< admonition example "" false >}}
This is the default example type admonition.
{{< /admonition >}}

{{< admonition quote "" false >}}
This is the default quote type admonition. Aliases: `cite`
{{< /admonition >}}

## Special Types

> [!center]
> This paragraph is **center-aligned**.
