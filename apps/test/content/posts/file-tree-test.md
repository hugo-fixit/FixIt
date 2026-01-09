---
title: File Tree Test
date: 2026-01-10T03:00:48+08:00
collections:
  - Tests
categories:
  - Shortcodes
tags:
  - file-tree
---

This article tests the **File Tree** shortcode functionality in the FixIt theme.

<!--more-->

```go-html-template
{{</* file-tree "xxx" */>}}
```

{{< file-tree "/" >}}
{{< file-tree "." >}}

{{< file-tree "content" >}}

{{< file-tree "content/posts" "0" >}}

{{< file-tree "posts" -1 >}}
