---
weight: 4
title: "主题文档 - 扩展 Shortcodes"
date: 2021-12-19T16:15:22+08:00
draft: false
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "FixIt 主题在 Hugo 内置的 shortcode 的基础上提供多个扩展的 shortcode"
resources:
- name: "featured-image"
  src: "featured-image.jpg"
- name: "featured-image-preview"
  src: "featured-image-preview.jpg"

tags: ["shortcodes"]
categories: ["documentation"]

lightgallery: true

menu:
  main:
    title: "FixIt 主题在 Hugo 内置的 shortcode 的基础上提供多个扩展的 shortcode"
    parent: "documentation"
    pre: "<i class='fa-brands fa-readme fa-fw fa-sm'></i>"
---

**FixIt** 主题在 Hugo 内置的 shortcode 的基础上提供多个扩展的 shortcode.

<!--more-->

## 1 style

{{< version 0.2.0 changed >}}

{{< admonition >}}
Hugo **extended** 版本对于 `style` shortcode 是必需的。
{{< /admonition >}}

`style` shortcode 用来在你的文章中插入自定义样式。

`style` shortcode 有两个位置参数。

第一个参数是自定义样式的内容。它支持 [:(fa-brands fa-sass fa-fw): SASS](https://sass-lang.com/documentation/style-rules/declarations#nesting) 中的嵌套语法，
并且 `&` 指代这个父元素。

第二个参数是包裹你要更改样式的内容的 HTML 标签，默认值是 `div`。

一个 `style` 示例：

```go-html-template
{{</* style "text-align:right; strong{color:#00b1ff;}" */>}}
This is a **right-aligned** paragraph.
{{</* /style */>}}
```

呈现的输出效果如下：

{{< style "text-align:right; strong{color:#00b1ff;}" >}}
This is a **right-aligned** paragraph.
{{< /style >}}

## 2 link

{{< version 0.2.0 >}}

`link` shortcode 是 [Markdown 链接语法](../basic-markdown-syntax#links) 的替代。
`link` shortcode 可以提供一些其它的功能并且可以在代码块中使用。

{{< version 0.2.10 >}} 支持 [本地资源引用](../theme-documentation-content#contents-organization) 的完整用法。

`link` shortcode 有以下命名参数：

* **href** *[必需]*（**第一个**位置参数）

    链接的目标。

* **content** *[可选]*（**第二个**位置参数）

    链接的内容，默认值是 **href** 参数的值。

    *支持 Markdown 或者 HTML 格式。*

* **title** *[可选]*（**第三个**位置参数）

    HTML `a` 标签 的 `title` 属性，当悬停在链接上会显示的提示。

* **card** *[可选]*（**第四个**位置参数）{{< version 0.2.12 >}}

    是否显示为卡片式链接，默认值 `false`。

* **download** *[可选]* {{< version 0.2.12 >}}

    HTML `a` 标签 的 `download` 属性。

* **class** *[可选]*

    HTML `a` 标签 的 `class` 属性。

* **rel** *[可选]*

    HTML `a` 标签 的 `rel` 补充属性。

* **external-icon** *[可选]* {{< version 0.2.14 >}}

    是否自动显示外链图标

一个 `link` 示例：

```go-html-template
{{</* link "https://assemble.io" */>}}
或者
{{</* link href="https://assemble.io" */>}}

{{</* link "mailto:contact@revolunet.com" */>}}
或者
{{</* link href="mailto:contact@revolunet.com" */>}}

{{</* link "https://assemble.io" Assemble */>}}
或者
{{</* link href="https://assemble.io" content=Assemble */>}}
```

呈现的输出效果如下：

* {{< link "https://assemble.io" >}}
* {{< link "mailto:contact@revolunet.com" >}}
* {{< link "https://assemble.io" Assemble >}}

一个带有标题的 `link` 示例：

```go-html-template
{{</* link "https://github.com/upstage/" Upstage "Visit Upstage!" */>}}
或者
{{</* link href="https://github.com/upstage/" content=Upstage title="Visit Upstage!" */>}}
```

呈现的输出效果如下 （将鼠标悬停在链接上，会有一行提示）:

{{< link "https://github.com/upstage/" Upstage "Visit Upstage!" >}}

一个卡片式 `link` 示例：

```go-html-template
{{</* link "https://github.com/Lruihao/FixIt" "FixIt Theme" "source of FixIt Theme" true */>}}
或者
{{</* link href="https://github.com/Lruihao/FixIt" content="FixIt Theme" title="source of FixIt Theme" card=true */>}}
```

呈现的输出效果如下：

{{< link "https://github.com/Lruihao/FixIt" "FixIt Theme" "source of FixIt Theme" true >}}

一个可下载的 `link` 示例：

```go-html-template
{{</* link href="/music/Wavelength.mp3" content="Wavelength" title="Download Wavelength.mp3" download="Wavelength.mp3" */>}}

{{</* link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" card=true */>}}
```

呈现的输出效果如下：

{{< link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" >}}

{{< link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" card=true >}}

## 3 image {#image}

{{< version 0.2.0 changed >}}

`image` shortcode 是 [`figure` shortcode](../theme-documentation-built-in-shortcodes#figure) 的替代。`image` shortcode 可以充分利用 [lazysizes](https://github.com/aFarkas/lazysizes) 和 [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js) 两个依赖库。

{{< version 0.2.10 >}} 支持 [本地资源引用](../theme-documentation-content#contents-organization) 的完整用法。

`image` shortcode 有以下命名参数：

* **src** *[必需]*（**第一个**位置参数）

    图片的 URL.

* **alt** *[可选]*（**第二个**位置参数）

    图片无法显示时的替代文本，默认值是 **src** 参数的值。

    *支持 Markdown 或者 HTML 格式。*

* **caption** *[可选]*（**第三个**位置参数）

    图片标题。

    *支持 Markdown 或者 HTML 格式。*

* **title** *[可选]*

    当悬停在图片上会显示的提示。

* **class** *[可选]*

    HTML `figure` 标签的 `class` 属性。

* **src_s** *[可选]*

    图片缩略图的 URL, 用在画廊模式中，默认值是 **src** 参数的值。

* **src_l** *[可选]*

    高清图片的 URL, 用在画廊模式中，默认值是 **src** 参数的值。

* **height** *[可选]*

    图片的 `height` 属性。

* **width** *[可选]*

    图片的 `width` 属性。

* **linked** *[可选]*

    图片是否需要被链接，默认值是 `true`。

* **rel** *[可选]*

    HTML `a` 标签 的 `rel` 补充属性，仅在 **linked** 属性设置成 `true` 时有效。

一个 `image` 示例：

```go-html-template
{{</* image src="/images/lighthouse.jpg" caption="Lighthouse (`image`)" src_s="/images/lighthouse-small.jpg" src_l="/images/lighthouse-large.jpg" */>}}
```

呈现的输出效果如下：

{{< image src="/images/lighthouse.jpg" caption="Lighthouse (`image`)" src_s="/images/lighthouse-small.jpg" src_l="/images/lighthouse-large.jpg" >}}

## 4 admonition

`admonition` shortcode 支持 **12** 种 帮助你在页面中插入提示的横幅。

*支持 Markdown 或者 HTML 格式。*

{{< admonition >}}
一个 **注意** 横幅
{{< /admonition >}}

{{< admonition abstract >}}
一个 **摘要** 横幅
{{< /admonition >}}

{{< admonition info >}}
一个 **信息** 横幅
{{< /admonition >}}

{{< admonition tip >}}
一个 **技巧** 横幅
{{< /admonition >}}

{{< admonition success >}}
一个 **成功** 横幅
{{< /admonition >}}

{{< admonition question >}}
一个 **问题** 横幅
{{< /admonition >}}

{{< admonition warning >}}
一个 **警告** 横幅
{{< /admonition >}}

{{< admonition failure >}}
一个 **失败** 横幅
{{< /admonition >}}

{{< admonition danger >}}
一个 **危险** 横幅
{{< /admonition >}}

{{< admonition bug >}}
一个 **Bug** 横幅
{{< /admonition >}}

{{< admonition example >}}
一个 **示例** 横幅
{{< /admonition >}}

{{< admonition quote >}}
一个 **引用** 横幅
{{< /admonition >}}

`admonition` shortcode 有以下命名参数：

* **type** *[必需]*（**第一个**位置参数）

    `admonition` 横幅的类型，默认值是 `note`。

* **title** *[可选]*（**第二个**位置参数）

    `admonition` 横幅的标题，默认值是 **type** 参数的值。（支持 markdown）{{< version 0.2.14 changed >}}

* **open** *[可选]*（**第三个**位置参数） {{< version 0.2.0 changed >}}

    横幅内容是否默认展开，默认值是 `true`。

一个 `admonition` 示例：

```go-html-template
{{</* admonition type=tip title="This is a tip" open=false */>}}
一个 **技巧** 横幅
{{</* /admonition */>}}
或者
{{</* admonition tip "This is a tip" false */>}}
一个 **技巧** 横幅
{{</* /admonition */>}}
```

呈现的输出效果如下：

{{< admonition tip "This is a tip" false >}}
一个 **技巧** 横幅
{{< /admonition >}}

## 5 mermaid

`mermaid` shortcode 使用 [Mermaid](https://mermaidjs.github.io/) 库提供绘制图表和流程图的功能。

完整文档请查看页面 [扩展 Shortcode - mermaid](../extended-shortcode-mermaid/)。

## 6 echarts

`echarts` shortcode 使用 [ECharts](https://echarts.apache.org/) 库提供数据可视化的功能。

完整文档请查看页面 [扩展 Shortcode - echarts](../extended-shortcode-echarts/)。

## 7 mapbox

`mapbox` shortcode 使用 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) 库提供互动式地图的功能。

完整文档请查看页面 [扩展 Shortcode - mapbox](../extended-shortcode-mapbox/)。

## 8 music

`music` shortcode 基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 库提供了一个内嵌的响应式音乐播放器。

完整文档请查看页面 [扩展 Shortcode - music](../extended-shortcode-music/)。

## 9 bilibili

`bilibili` shortcode 提供了一个内嵌的用来播放 bilibili 视频的响应式播放器。

完整文档请查看页面 [扩展 Shortcode - bilibili](../extended-shortcode-bilibili/)。

## 10 typeit

`typeit` shortcode 基于 [TypeIt](https://typeitjs.com/) 提供了打字动画。

完整文档请查看页面 [扩展 Shortcode - typeit](../extended-shortcode-typeit/)。

## 11 script

{{< version 0.2.8 >}}

`script` shortcode 用来在你的文章中插入 **:(fa-brands fa-js fa-fw): Javascript** 脚本。

{{< admonition >}}
脚本内容可以保证在所有的第三方库加载之后按顺序执行。
所以你可以自由地使用第三方库。
{{< /admonition >}}

一个 `script` 示例：

```go-html-template
{{</* script */>}}
console.log('Hello FixIt!');
{{</* /script */>}}
```

你可以在开发者工具的控制台中看到输出。

{{< script >}}
console.log('Hello FixIt!');
{{< /script >}}

## 12 details

{{< version 0.2.13 >}} {{< version 0.2.14 changed >}}

`details` shortcode 用来在你的文章中插入 **:(fa-brands fa-html5 fa-fw): HTML5 标签** details 和 summary。

`details` shortcode 只有一个参数：
- **summary** *[可选]* (**第一个**位置参数）

    summary 标签的内容（支持 markdown）

一个 `details` 示例：

```go-html-template
{{</* details "**Copyright** 2022." */>}}
*All pages and graphics on this web site are the property of FixIt.*
{{</* /details */>}}
或者
{{</* details summary="**Copyright** 2022." */>}}
*All pages and graphics on this web site are the property of FixIt.*
{{</* /details */>}}
```

呈现的输出效果如下：

{{< details "**Copyright** 2022." >}}
*All pages and graphics on this web site are the property of FixIt.*
{{< /details >}}

## 13 center-quote

{{< version 0.2.13 >}} {{< version 0.2.14 changed >}}

`center-quote` shortcode 用来在你的文章中插入文本居中的 blockquote 标签。

一个 `center-quote` 示例：

```go-html-template
{{%/* center-quote */%}}
**hello** *world*  
this is a center-quote shortcode example.
{{%/* /center-quote */%}}
```

呈现的输出效果如下：

{{% center-quote %}}
**hello** *world*  
this is a center-quote shortcode example.
{{% /center-quote %}}

## 14 fixit-encryptor

{{< version 0.2.15 >}}

您可以使用 `fixit-encryptor` shortcode 来加密部分内容。

完整文档请查看页面 [主题文档 - 内容加密](../theme-documentation-content-encryption/#partial-encryption)。

---

{{< admonition quote "感谢" >}}
_本文档中 `v0.2.10` 版本之前的内容，感谢原作者 [Dillon](https://dillonzq.com) 编写修订。_
{{< /admonition >}}