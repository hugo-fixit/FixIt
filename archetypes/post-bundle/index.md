---
# command: `hugo new --kind post-bundle posts/my-post`
title: "{{ replace .TranslationBaseName "-" " " | title }}"
subtitle: ""
date: {{ .Date }}
draft: true
author: ""
authorLink: ""
description: ""
keywords: ""
license: ""
comment: false

tags:
- draft
categories:
- draft

hiddenFromHomePage: false
hiddenFromSearch: false

# custom summary instead of <!--more-->
summary: ""
# Full link or relative root link of image
featuredImage: ""
featuredImagePreview: ""
# Or contain featuredImage and featuredImagePreview into resources
resources:
- name: "featured-image"
  src: ""
- name: "featured-image-preview"
  src: ""

toc:
  enable: true
math:
  enable: false
lightgallery: false
---

<!--more-->