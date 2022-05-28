---
title: "主题文档 - 内容加密"
date: 2022-05-28T11:51:41+08:00
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "了解如何在 FixIt 主题中加密内容。"
password: 1212
message: "Password is 1212"

resources:
- name: "featured-image"
  src: "featured-image.png"

tags:
- Encryption
categories:
- documentation
---

了解如何在 FixIt 主题中加密内容。

<!--more-->

## 全文加密

### 前置参数

FixIt 主题提供了两个前置参数用于全文加密。

* **password**: *[必需]* 加密页面内容的密码
* **message**: *[可选]* 加密提示信息

例如，本文的前置参数如下：

```yaml
title: "主题文档 - 内容加密"
date: 2022-05-28T11:51:41+08:00
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "了解如何在 FixIt 主题中加密内容。"
password: 1212
message: "Password is 1212"

resources:
- name: "featured-image"
  src: "featured-image.png"

tags:
- Encryption
categories:
- documentation
```

{{< admonition info >}}

1. 每次输入正确密码后，会在用户本地缓存密码 hash 值，一天之内再次访问时，将自动解锁文章
2. 文章最后提供有一个 “重新加密” 的按钮，点击即可立即忘记密码，并重新加密内容
3. 加密文章已从搜索中隐藏
4. 加密文章的 Markdown 输出已禁用，为了防止密码泄漏，**请勿将加密文章已任何形式公开**

{{< /admonition >}}

### 进阶使用

FixIt Dcryptor 有两个生命周期钩子函数，详见 [Class FixItDecryptor API](/theme-documentation-content-encryption/#fixit-decryptor-api)

例如在解锁文章后，输出文本：

```go-html-template
{{</* script */>}}
document.addEventListener('DOMContentLoaded', () => {
  fixit.theme.decryptor.addEventListener('decrypted', function() {
    console.log('after password decryption')
  })
  if (window.localStorage.getItem(`fixit-decryptor/#${location.pathname}`)) {
    console.log('after automatic decryption')
  }
});
{{</* /script */>}}
```

您可以在开发人员工具的控制台中看到输出。

{{< script >}}
document.addEventListener('DOMContentLoaded', () => {
  fixit.decryptor.addEventListener('decrypted', function() {
    console.log('after password decryption')
  })
  if (window.localStorage.getItem(`fixit-decryptor/#${location.pathname}`)) {
    console.log('after automatic decryption')
  }
});
{{< /script >}}

## 部分加密

- [ ] fixit-encryptor shortcode

## 结语

相比于通过 Golang/Python/JavaScript 等以脚本批处理的方式加密内容，FixIt 主题内置加密具有以下优缺点：

* **优点**：易用性高，开箱即用，无需进一步批处理
* **缺点**：安全性低，加密算法受限于 `go-html-template` 语法

> “最简单的密码，就足以防住 90% 的人！”
>
> 隐私无小事，重要私密的内容请勿上传，各自妥善保管！
