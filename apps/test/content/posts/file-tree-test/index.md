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

#### JSON format

{{< file-tree >}}
[
  {
    "name": "src",
    "type": "dir",
    "children": [
      {
        "name": "index.ts",
        "type": "file"
      },
      {
        "name": "app.ts",
        "type": "file"
      }
    ]
  },
  {
    "name": "README.md",
    "type": "file"
  },
  {
    "name": ".gitignore",
    "type": "file"
  }
]
{{< /file-tree >}}

#### YAML format

{{< file-tree folderSlash=true >}}
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
{{< /file-tree >}}

### File data

#### TOML format

{{< file-tree file="data/example.toml" />}}

TOML with folder slash and level 3:

{{< file-tree file="data/example.toml" level=3 folderSlash=true />}}

#### JSON format

{{< file-tree file="filetree/example.json" />}}

JSON with folder slash and level 2:

{{< file-tree file="filetree/example.json" level=2 folderSlash=true />}}

#### YAML format

Trying the file not found case (should fallback to next mode):

{{< file-tree file="data/nonexistent.yaml" data="example" />}}

### Site data

#### Basic usage

{{< file-tree data="example" />}}

#### Fully expanded

{{< file-tree data="example" level=-1 />}}

#### Limited expansion

{{< file-tree data="example" level=1 />}}

#### With folder slash

{{< file-tree data="example" folderSlash=true />}}

#### With level and folder slash

{{< file-tree data="example" level=2 folderSlash=true />}}

#### Collapsed with ignore

{{< file-tree data="example" level=0 ignoreList="README.md" />}}

## Filesystem Mode

### Basic paths

{{< file-tree />}}

{{< file-tree "." />}}

{{< file-tree "content" />}}

{{< file-tree name="{path}" />}}

{{< file-tree name="FixIt/apps/test" />}}

{{< file-tree path="posts" name="{path}" />}}

### Named parameters

{{< file-tree path="data" level=2 />}}

### Expansion levels

{{< file-tree "assets" 0 />}}

{{< file-tree path="assets" level=2 folderSlash=true />}}

{{< file-tree "assets" -1 />}}

### With ignore lists

{{< file-tree ignoreList=".hugo_build.lock, public, resources, node_modules" level=2 folderSlash=true />}}

### root not exist

path="nonexistent/path"

{{< file-tree "nonexistent/path" />}}

## Code Block Rendering

### Basic code block

YAML format:

```file-tree
- name: my-project
  type: dir
  children:
    - name: src
      type: dir
      children:
        - name: main.js
          type: file
        - name: utils.js
          type: file
    - name: package.json
      type: file
    - name: README.md
      type: file
```

### TOML format

```file-tree
[[filetree]]
name = "src"
type = "dir"

[[filetree.children]]
name = "index.ts"
type = "file"

[[filetree]]
name = "README.md"
type = "file"
```

### With parameters

```file-tree {level=2 folderSlash=true ignoreList="config.local.js"}
- name: project
  type: dir
  children:
    - name: config
      type: dir
      children:
        - name: config.js
          type: file
        - name: config.local.js
          type: file
    - name: src
      type: dir
      children:
        - name: index.js
          type: file
    - name: .gitignore
      type: file
```

### Fully expanded

```file-tree {level=-1 folderSlash=true}
- name: backend
  type: dir
  children:
    - name: api
      type: dir
      children:
        - name: routes
          type: dir
          children:
            - name: users.js
              type: file
            - name: posts.js
              type: file
        - name: controllers
          type: dir
          children:
            - name: userController.js
              type: file
    - name: database
      type: dir
      children:
        - name: models
          type: dir
        - name: migrations
          type: dir
    - name: app.js
      type: file
```
