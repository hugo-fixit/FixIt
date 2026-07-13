---
title: {{ replace .TranslationBaseName "-" " " | title }}
subtitle:
date: {{ .Date }}
slug: {{ substr .File.UniqueID 0 7 }}
draft: true
description:
keywords:
weight: 0
categories:
  - draft
collections:
  - draft
tags:
  - draft
summary:
resources:
  - name: featured-image
    src: featured-image.jpg
  - name: featured-image-preview
    src: featured-image-preview.jpg
password:
message:
repost:
  enable: false
  url:

# See: https://fixit.lruihao.cn/docs/content-management/front-matter/
---

<!--more-->

<!-- Place resource files in the current article directory and reference them using relative paths, like this: `![alt](images/screenshot.jpg)`. -->
