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
<!-- markdownlint-disable-file MD007 MD024 MD032 -->

## Content Modes

### Shortcode body

#### TOML format

{{< file-tree >}}
[[filetree]]
name = "src"
type = "dir"

[[filetree.children]]
name = "index.ts"
type = "file"

[[filetree.children]]
name = "app.ts"
type = "file"

[[filetree]]
name = "README.md"
type = "file"

[[filetree]]
name = ".gitignore"
type = "file"
{{< /file-tree >}}

#### YAML format

{{< file-tree >}}
- name: project-root
  type: dir
  children:
    - name: src
      type: dir
      children:
        - name: index.ts
          type: file
        - name: config.ts
          type: file
    - name: tests
      type: dir
      children:
        - name: unit.test.ts
          type: file
    - name: package.json
      type: file
    - name: tsconfig.json
      type: file
{{< /file-tree >}}

#### YAML with folderSlash

{{< file-tree folderSlash=true >}}
- name: workspace
  type: dir
  children:
    - name: docs
      type: dir
      children:
        - name: guide.md
          type: file
        - name: api.md
          type: file
    - name: src
      type: dir
      children:
        - name: main.js
          type: file
    - name: LICENSE
      type: file
{{< /file-tree >}}

### File data

#### TOML format

{{< file-tree file="data/example.toml" />}}

TOML with folder slash and level 3:

{{< file-tree file="data/example.toml" level="3" folderSlash="true" />}}

#### JSON format

{{< file-tree file="filetree/example.json" />}}

JSON with folder slash and level 2:

{{< file-tree file="filetree/example.json" level="2" folderSlash="true" />}}

#### YAML format

Trying the file not found case (should fallback to next mode):

{{< file-tree file="data/nonexistent.yaml" data="example" />}}

### Site data

#### Basic usage

{{< file-tree data="example" />}}

#### Fully expanded

{{< file-tree data="example" level="-1" />}}

#### Limited expansion

{{< file-tree data="example" level="1" />}}

#### With folder slash

{{< file-tree data="example" folderSlash="true" />}}

#### With level and folder slash

{{< file-tree data="example" level="2" folderSlash="true" />}}

#### Collapsed with ignore

{{< file-tree data="example" level="0" ignoreList="README.md" />}}

##### Deep collapsed

{{< file-tree data="example" level="0" folderSlash="true" ignoreList="images, test" />}}

## Filesystem Mode

### Basic paths

{{< file-tree />}}

{{< file-tree "." />}}

{{< file-tree "content" />}}

### Named parameters

{{< file-tree path="data" level="2" />}}

### Expansion levels

{{< file-tree "assets" "0" />}}

{{< file-tree path="assets" level="2" folderSlash="true" />}}

{{< file-tree "assets" -1 />}}

### With ignore lists

{{< file-tree ignoreList=".hugo_build.lock, public, resources, node_modules" level="2" folderSlash="true" />}}
