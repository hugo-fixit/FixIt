---
weight: 4
title: "Theme Documentation - Extended Shortcodes"
date: 2021-12-19T16:15:22+08:00
draft: false
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "FixIt theme provides multiple shortcodes on top of built-in ones in Hugo."
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
    name: "Extended Shortcodes"
    title: "FixIt theme provides multiple shortcodes on top of built-in ones in Hugo."
    parent: "documentation"
    pre: "<i class='fa-brands fa-readme fa-fw fa-sm'></i>"
---

**FixIt** theme provides multiple shortcodes on top of built-in ones in Hugo.

<!--more-->

## 1 style

{{< version 0.2.0 changed >}}

{{< admonition >}}
Hugo **extended** version is necessary for `style` shortcode.
{{< /admonition >}}

`style` is a shortcode to insert custom style in your post.

The `style` shortcode has two positional parameters.

The **first** one is the custom style content,
which supports nesting syntax in [:(fa-brands fa-sass fa-fw): SASS](https://sass-lang.com/documentation/style-rules/declarations#nesting)
and `&` referring to this parent HTML element.

And the **second** one is the tag name of the HTML element wrapping the content you want to change style, and whose default value is `div`.

Example `style` input:

```go-html-template
{{</* style "text-align:right; strong{color:#00b1ff;}" */>}}
This is a **right-aligned** paragraph.
{{</* /style */>}}
```

The rendered output looks like this:

{{< style "text-align:right; strong{color:#00b1ff;}" >}}
This is a **right-aligned** paragraph.
{{< /style >}}

## 2 link

{{< version 0.2.0 >}}

`link` shortcode is an alternative to [Markdown link syntax](../basic-markdown-syntax#links). `link` shortcode can provide some other features and can be used in code blocks.

{{< version 0.2.10 >}} The complete usage of [local resource references](../theme-documentation-content#contents-organization) is supported.

The `link` shortcode has the following named parameters:

* **href** *[required]* (**first** positional parameter)

    Destination of the link.

* **content** *[optional]* (**second** positional parameter)

    Content of the link, default value is the value of **href** parameter.

    *Markdown or HTML format is supported.*

* **title** *[optional]* (**third** positional parameter)

    `title` attribute of the HTML `a` tag, which will be shown when hovering on the link.

* **card** *[optional]* (**fourth** positional parameter) {{< version 0.2.12 >}}

    是否显示为卡片式链接，默认值 `false`。

* **download** *[optional]* {{< version 0.2.12 >}}

    `optional` attribute of the HTML `a` tag.

* **class** *[optional]*

    `class` attribute of the HTML `a` tag.

* **rel** *[optional]*

    Additional `rel` attributes of the HTML `a` tag.

* **external-icon** *[optional]* {{< version 0.2.14 >}}

    whether to add external Icon for external links automatically

Example `link` input:

```go-html-template
{{</* link "https://assemble.io" */>}}
Or
{{</* link href="https://assemble.io" */>}}

{{</* link "mailto:contact@revolunet.com" */>}}
Or
{{</* link href="mailto:contact@revolunet.com" */>}}

{{</* link "https://assemble.io" Assemble */>}}
Or
{{</* link href="https://assemble.io" content=Assemble */>}}
```

The rendered output looks like this:

* {{< link "https://assemble.io" >}}
* {{< link "mailto:contact@revolunet.com" >}}
* {{< link "https://assemble.io" Assemble >}}

Example `link` input with a title:

```go-html-template
{{</* link "https://github.com/upstage/" Upstage "Visit Upstage!" */>}}
Or
{{</* link href="https://github.com/upstage/" content=Upstage title="Visit Upstage!" */>}}
```

The rendered output looks like this (hover over the link, there should be a tooltip):

{{< link "https://github.com/upstage/" Upstage "Visit Upstage!" >}}

Example `link` input for card type:

```go-html-template
{{</* link "https://github.com/Lruihao/FixIt" "FixIt Theme" "source of FixIt Theme" true */>}}
Or
{{</* link href="https://github.com/Lruihao/FixIt" content="FixIt Theme" title="source of FixIt Theme" card=true */>}}
```

The rendered output looks like this:

{{< link "https://github.com/Lruihao/FixIt" "FixIt Theme" "source of FixIt Theme" true >}}

Example `link` input with download attribute:

```go-html-template
{{</* link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" */>}}

{{</* link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" card=true */>}}
```

The rendered output looks like this:

{{< link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" >}}

{{< link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" card=true >}}

## 3 image {#image}

{{< version 0.2.0 changed >}}

`image` shortcode is an alternative to [`figure` shortcode](../theme-documentation-built-in-shortcodes#figure). `image` shortcode can take full advantage of the dependent libraries of [lazysizes](https://github.com/aFarkas/lazysizes) and [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js).

{{< version 0.2.10 >}} The complete usage of [local resource references](../theme-documentation-content#contents-organization) is supported.

The `image` shortcode has the following named parameters:

* **src** *[required]* (**first** positional parameter)

    URL of the image to be displayed.

* **alt** *[optional]* (**second** positional parameter)

    Alternate text for the image if the image cannot be displayed, default value is the value of **src** parameter.

    *Markdown or HTML format is supported.*

* **caption** *[optional]* (**third** positional parameter)

    Image caption.

    *Markdown or HTML format is supported.*

* **title** *[optional]*

    Image title that will be shown when hovering on the image.

* **class** *[optional]*

    `class` attribute of the HTML `figure` tag.

* **src_s** *[optional]*

    URL of the image thumbnail, used for lightgallery, default value is the value of **src** parameter.

* **src_l** *[optional]*

    URL of the HD image, used for lightgallery, default value is the value of **src** parameter.

* **height** *[optional]*

    `height` attribute of the image.

* **width** *[optional]*

    `width` attribute of the image.

* **linked** *[optional]*

    Whether the image needs to be hyperlinked, default value is `true`.

* **rel** *[optional]*

    Additional `rel` attributes of the HTML `a` tag, if **linked** parameter is set to `true`.

Example `image` input:

```go-html-template
{{</* image src="/images/lighthouse.jpg" caption="Lighthouse (`image`)" src_s="/images/lighthouse-small.jpg" src_l="/images/lighthouse-large.jpg" */>}}
```

The rendered output looks like this:

{{< image src="/images/lighthouse.jpg" caption="Lighthouse (`image`)" src_s="/images/lighthouse-small.jpg" src_l="/images/lighthouse-large.jpg" >}}

## 4 admonition

The `admonition` shortcode supports **12** types of banners to help you put notice in your page.

*Markdown or HTML format in the content is supported.*

{{< admonition >}}
A **note** banner
{{< /admonition >}}

{{< admonition abstract >}}
An **abstract** banner
{{< /admonition >}}

{{< admonition info >}}
A **info** banner
{{< /admonition >}}

{{< admonition tip >}}
A **tip** banner
{{< /admonition >}}

{{< admonition success >}}
A **success** banner
{{< /admonition >}}

{{< admonition question >}}
A **question** banner
{{< /admonition >}}

{{< admonition warning >}}
A **warning** banner
{{< /admonition >}}

{{< admonition failure >}}
A **failure** banner
{{< /admonition >}}

{{< admonition danger >}}
A **danger** banner
{{< /admonition >}}

{{< admonition bug >}}
A **bug** banner
{{< /admonition >}}

{{< admonition example >}}
An **example** banner
{{< /admonition >}}

{{< admonition quote >}}
A **quote** banner
{{< /admonition >}}

The `admonition` shortcode has the following named parameters:

* **type** *[optional]* (**first** positional parameter)

    Type of the `admonition` banner, default value is `note`.

* **title** *[optional]* (**second** positional parameter)

    Title of the `admonition` banner, default value is the value of **type** parameter. (markdown support) {{< version 0.2.14 changed >}}

* **open** *[optional]* (**third** positional parameter) {{< version 0.2.0 changed >}}

    Whether the content will be expandable by default, default value is `true`.

Example `admonition` input:

```go-html-template
{{</* admonition type=tip title="This is a tip" open=false */>}}
A **tip** banner
{{</* /admonition */>}}
Or
{{</* admonition tip "This is a tip" false */>}}
A **tip** banner
{{</* /admonition */>}}
```

The rendered output looks like this:

{{< admonition tip "This is a tip" false >}}
A **tip** banner
{{< /admonition >}}

## 5 mermaid

The `mermaid` shortcode supports diagrams in Hugo with [Mermaid](https://mermaidjs.github.io/) library.

The full documentation is provided in [Extended Shortcode - mermaid](../extended-shortcode-mermaid/).

## 6 echarts

The `echarts` shortcode supports data visualization in Hugo with [ECharts](https://echarts.apache.org/) library.

The full documentation is provided in [Extended Shortcode - echarts](../extended-shortcode-echarts/).

## 7 mapbox

The `mapbox` shortcode supports interactive maps in Hugo with [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) library.

The full documentation is provided in [Extended Shortcode - mapbox](../extended-shortcode-mapbox/).

## 8 music

The `music` shortcode embeds a responsive music player based on [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS) library.

The full documentation is provided in [Extended Shortcode - music](../extended-shortcode-music/).

## 9 bilibili

The `bilibili` shortcode embeds a responsive video player for bilibili videos.

The full documentation is provided in [Extended Shortcode - bilibili](../extended-shortcode-bilibili/).

## 10 typeit

The `typeit` shortcode provides typing animation based on [TypeIt](https://typeitjs.com/).

The full documentation is provided in [Extended Shortcode - typeit](../extended-shortcode-typeit/).

## 11 script

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

## 12 details

{{< version 0.2.13 >}} {{< version 0.2.14 changed >}}

`details` is a shortcode to insert **:(fa-brands fa-html5 fa-fw): HTML5 tag** details and summary in your post.

The `details` shortcode has only one parameter:

- **summary** *[optional]* (**first** positional parameter)

    summary of details. (markdown support)

Example `details` input:

```go-html-template
{{</* details "**Copyright** 2022." */>}}
*All pages and graphics on this web site are the property of FixIt.*
{{</* /details */>}}
Or
{{</* details summary="**Copyright** 2022." */>}}
*All pages and graphics on this web site are the property of FixIt.*
{{</* /details */>}}
```

The rendered output looks like this:

{{< details "**Copyright** 2022." >}}
*All pages and graphics on this web site are the property of FixIt.*
{{< /details >}}

## 13 center-quote

{{< version 0.2.13 >}} {{< version 0.2.14 changed >}}

`center-quote` is a shortcode to insert centered text blockquote tag in your post.

Example `center-quote` input:

```go-html-template
{{%/* center-quote */%}}
**hello** *world*  
this is a center-quote shortcode example.
{{%/* /center-quote */%}}
```

The rendered output looks like this:

{{% center-quote %}}
**hello** *world*  
this is a center-quote shortcode example.
{{% /center-quote %}}


## 14 fixit-encryptor

{{< version 0.2.15 >}}

You can use `fixit-encryptor` shortcode to encrypt partial content.

The full documentation is provided in [Theme Documentation - Content Encryption](../theme-documentation-content-encryption/#partial-encryption).

---

{{< admonition quote "Thanks" >}}
_Thanks to the original author [Dillon](https://dillonzq.com) for preparing and revising the content before version `v0.2.10` in this documentation._
{{< /admonition >}}