---
title: "扩展 Shortcode - bilibili"
date: 2022-07-20T13:55:03+08:00
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "bilibili shortcode 提供了一个内嵌的用来播放 bilibili 视频的响应式播放器。"
resources:
- name: "featured-image"
  src: "featured-image.jpg"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true
---

{{< version 0.2.0 changed >}}

`bilibili` shortcode 提供了一个内嵌的用来播放 bilibili 视频的响应式播放器。

<!--more-->

如果视频只有一个部分，则仅需要视频的 BV `id`, 例如：

```code
https://www.bilibili.com/video/BV1Sx411T7QQ
```

一个 `bilibili` 示例：

```go-html-template
{{</* bilibili BV1Sx411T7QQ */>}}
或者
{{</* bilibili id=BV1Sx411T7QQ */>}}
```

呈现的输出效果如下：

{{< bilibili id=BV1Sx411T7QQ >}}

如果视频包含多个部分，则除了视频的 BV `id` 之外，还需要 `p`, 默认值为 `1`, 例如：

```code
https://www.bilibili.com/video/BV1TJ411C7An?p=3
```

一个带有 `p` 参数的 `bilibili` 示例：

```go-html-template
{{</* bilibili BV1TJ411C7An 3 */>}}
或者
{{</* bilibili id=BV1TJ411C7An p=3 */>}}
```

呈现的输出效果如下：

{{< bilibili id=BV1TJ411C7An p=3 >}}