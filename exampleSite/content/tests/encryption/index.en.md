---
title: "Encrypt Test"
date: 2022-05-21T22:31:22+08:00
description: "Test for encrypting content"
type: 'posts'
draft: true
password: 1212
message: Password is 1212

lightgallery: true

math:
  enable: true

twemoji: true

tags:
- Test
- Encryption
categories:
- Test

menu:
  main:
    title: "Test for encrypting content"
    parent: "tests"
    pre: "<i class='fa-solid fa-vial fa-fw fa-sm'></i>"
---

I was shy, so I hid.

<!--more-->

![Hugo Theme FixIt](/images/Apple-Devices-Preview.png "Hugo Theme FixIt")

## Encrypted Content

### twemoji

Coffee ☕

Gone camping! :tent: Be back soon.

That is so funny! :joy:

### ruby
[Hugo]^(An open-source static site generator)

### math
$$ \ce{CO2 + C -> 2 CO} $$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$

## Shortcodes in Encrypted Content

### 1 style

{{< style "text-align:right; strong{color:#00b1ff;}" >}}
This is a **right-aligned** paragraph.
{{< /style >}}

### 2 link

{{< link "https://github.com/upstage/" Upstage "Visit Upstage!" >}}

{{< link "https://github.com/Lruihao/FixIt" "FixIt Theme" "source of FixIt Theme" true >}}

{{< link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" >}}

{{< link href="/music/Wavelength.mp3" content="Wavelength.mp3" title="Download Wavelength.mp3" download="Wavelength.mp3" card=true >}}

### 3 image

{{< image src="/images/lighthouse.jpg" caption="Lighthouse (`image`)" src_s="/images/lighthouse-small.jpg" src_l="/images/lighthouse-large.jpg" >}}

### 4 admonition

{{< admonition tip "This is a tip" false >}}
A **tip** banner
{{< /admonition >}}

### 5 mermaid

{{< mermaid >}}
graph LR;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
{{< /mermaid >}}

### 6 echarts

{{< echarts >}}
title:
    text: Summary Line Chart
    top: 2%
    left: center
tooltip:
    trigger: axis
legend:
    data:
        - Email Marketing
        - Affiliate Advertising
        - Video Advertising
        - Direct View
        - Search Engine
    top: 10%
grid:
    left: 5%
    right: 5%
    bottom: 5%
    top: 20%
    containLabel: true
toolbox:
    feature:
        saveAsImage:
            title: Save as Image
xAxis:
    type: category
    boundaryGap: false
    data:
        - Monday
        - Tuesday
        - Wednesday
        - Thursday
        - Friday
        - Saturday
        - Sunday
yAxis:
    type: value
series:
    - name: Email Marketing
      type: line
      stack: Total
      data:
          - 120
          - 132
          - 101
          - 134
          - 90
          - 230
          - 210
    - name: Affiliate Advertising
      type: line
      stack: Total
      data:
          - 220
          - 182
          - 191
          - 234
          - 290
          - 330
          - 310
    - name: Video Advertising
      type: line
      stack: Total
      data:
          - 150
          - 232
          - 201
          - 154
          - 190
          - 330
          - 410
    - name: Direct View
      type: line
      stack: Total
      data:
          - 320
          - 332
          - 301
          - 334
          - 390
          - 330
          - 320
    - name: Search Engine
      type: line
      stack: Total
      data:
          - 820
          - 932
          - 901
          - 934
          - 1290
          - 1330
          - 1320
{{< /echarts >}}

### 7 mapbox

{{< mapbox 113.953277 22.559102 11 >}}

### 8 music

{{< music url="/music/Wavelength.mp3" name=Wavelength artist=oldmanyoung cover="/images/Wavelength.jpg" >}}

### 9 bilibili

{{< bilibili BV1Sx411T7QQ >}}

### 10 typeit

{{< typeit code=javascript >}}
console.log('before decrypting');

document.addEventListener('DOMContentLoaded', () => {
  fixit.decryptor.addEventListener('decrypted', function() {
    console.log('after decrypting')
  })
});
{{< /typeit >}}

### 11 script

```go-html-template
{{</* script */>}}
console.log('before decrypting');

document.addEventListener('DOMContentLoaded', () => {
  fixit.theme.decryptor.addEventListener('decrypted', function() {
    console.log('after decrypting')
  })
});
{{</* /script */>}}
```

You can see the output in the console of the developer tool.

{{< script >}}
console.log('before decrypting');

document.addEventListener('DOMContentLoaded', () => {
  fixit.decryptor.addEventListener('decrypted', function() {
    console.log('after decrypting')
  })
});
{{< /script >}}

### 12 details

{{< details "**Copyright** 2022." >}}
*All pages and graphics on this web site are the property of FixIt.*
{{< /details >}}

### 13 center-quote

{{% center-quote %}}
**hello** *world*  
this is a center-quote shortcode example.
{{% /center-quote %}}
