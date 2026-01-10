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

{{< file-tree >}}
{{< file-tree "." >}}
{{< file-tree "/" >}}
{{< file-tree "./" >}}
{{< file-tree "content" >}}
{{< file-tree "content/posts" "0" >}}
{{< file-tree "posts" -1 >}}

---

{{< file-tree ignoreList=".hugo_build.lock, public, resources" >}}
{{< file-tree path="content" level="2" folderSlash="true" >}}
