---
title: Color Preview Test
date: 2025-08-17T17:20:00+08:00
collections:
  - Tests
categories:
  - Markdown
tags:
  - Color Preview
---

This post is a test post to preview the color syntax in Markdown.

<!--more-->

## 📝 Syntax

| Color | Syntax             | Example                    | Output               |
| ----- | ------------------ | -------------------------- | -------------------- |
| HEX   | `` `#RRGGBB` ``    | `` `#0969DA` ``            | `#0969DA`            |
| RGB   | `` `rgb(R,G,B)` `` | `` `rgb(9, 105, 218)` ``   | `rgb(9, 105, 218)`   |
| HSL   | `` `hsl(H,S,L)` `` | `` `hsl(212, 92%, 45%)` `` | `hsl(212, 92%, 45%)` |

e.g. The background color is `#ffffff` for light mode and `#000000` for dark mode.

## ✅ Color Preview

Pure color values (no leading/trailing characters):

- `#0969DA`
- `#096`
- `#FF0000`
- `#00FF00`
- `rgb(255, 0, 0)`
- `rgb(0, 255, 0)`
- `hsl(240, 100%, 50%)`
- `hsl(120, 100%, 50%)`

Theme colors:

| Type      | Light     | Dark      |
| :-------: | :-------: | :-------: |
| Primary   | `#1677ff` | `#0069fc` |
| Secondary | `#8b949e` | `#7d8792` |
| Success   | `#52c41a` | `#49ad17` |
| Info      | `#13c2c2` | `#11abab` |
| Warning   | `#faad14` | `#efa105` |
| Danger    | `#ff4d4f` | `#ff3436` |

## ❌ Regular Code

With leading or trailing characters:

- `test #0969DA`
- `#0969DA test`
- `color: #0969DA`
- ` #0969DA` (leading space)
- `#0969DA ` (trailing space)
- `background-color: rgb(255, 0, 0)`
- `using hsl(240, 100%, 50%) color`
