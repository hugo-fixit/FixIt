---
title: "Encrypt Test"
date: 2022-05-21T22:31:22+08:00
description: "Test for encrypting content"
type: 'posts'
draft: true
password: 1212
message: password is 1212

tags:
- Test
- Encrypt
categories:
- Test

menu:
  main:
    title: "Test for encrypting content"
    parent: "tests"
    pre: "<i class='fa-solid fa-vial fa-fw fa-sm'></i>"
---

I was shy, so I hid.

<!-- emoji render error -->

## Shortcodes in encrypted Content

{{< version 0.2.8 >}}

`script` is a shortcode to insert custom **:(fa-brands fa-js fa-fw): Javascript** in your post.

{{< admonition >}}
The script content can be guaranteed to be executed in order after all third-party libraries are loaded. So you are free to use third-party libraries.
{{< /admonition >}}

Example `script` input:

```go-html-template
{{</* script */>}}
console.log('Hello FixIt!');
{{</* /script */>}}
```

You can see the output in the console of the developer tool.

{{< script >}}
console.log('Hello FixIt!');
{{< /script >}}