---
title: "Extended Shortcode - bilibili"
date: 2022-07-20T13:55:03+08:00
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "The bilibili shortcode embeds a responsive video player for bilibili videos."
resources:
- name: "featured-image"
  src: "featured-image.jpg"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true
---

{{< version 0.2.0 changed >}}

The `bilibili` shortcode embeds a responsive video player for bilibili videos.

<!--more-->

When the video only has one part, only the BV `id` of the video is required, e.g.:

```code
https://www.bilibili.com/video/BV1Sx411T7QQ
```

Example `bilibili` input:

```go-html-template
{{</* bilibili BV1Sx411T7QQ */>}}
Or
{{</* bilibili id=BV1Sx411T7QQ */>}}
```

The rendered output looks like this:

{{< bilibili id=BV1Sx411T7QQ >}}

When the video has multiple parts, in addition to the BV `id` of the video,
`p` is also required, whose default value is `1`, e.g.:

```code
https://www.bilibili.com/video/BV1TJ411C7An?p=3
```

Example `bilibili` input with `p`:

```go-html-template
{{</* bilibili BV1TJ411C7An 3 */>}}
Or
{{</* bilibili id=BV1TJ411C7An p=3 */>}}
```

The rendered output looks like this:

{{< bilibili id=BV1TJ411C7An p=3 >}}