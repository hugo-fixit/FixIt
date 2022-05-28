---
title: "Theme Documentation - Content Encryption"
date: 2022-05-28T11:51:41+08:00
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "Find out how to encrypt content in FixIt theme."
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

Find out how to encrypt content in FixIt theme.

<!--more-->

## Page Encryption

### Frontmatter

The FixIt theme provides two frontmatters for page encryption.

* **password**: *[required]* password of encrypted page content
* **message**: *[optional]* encryption prompt

For example, the frontmatters in this article are as follows:

```yaml
---
title: "Theme Documentation - Content Encryption"
date: 2022-05-28T11:51:41+08:00
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "Find out how to encrypt content in FixIt theme."
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
```


{{< admonition info >}}

1. After entering the correct password each time, the password hash value will be cached locally by the user, and the pages will be unlocked automatically when accessed again within one day
2. A "Encrypt again" button is provided at the end of the article. Click it to immediately forget the password and re encrypt the content
3. Encrypted pages have been hidden from search
4. The markdown output of encrypted pages has been disabled. To prevent password disclosure, **do not make encrypted pages public in any form**

{{< /admonition >}}

### Advanced use

FixIt Dcryptor has two lifecycle hooks, see [Class FixItDecryptor API](#fixit-decryptor-api)

For example, after unlocking the article, output the text:

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

You can see the output in the console of the developer tool.

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

## Partial encryption

- [ ] fixit-encryptor shortcode

## Summary

Compared with encrypting content through script batch processing such as golang/python/javascript, FixIt theme built-in encryption has the following advantages and disadvantages:

* **Advantages**: High usability, out of the box, without further batch processing
* **Disadvantages**: Low security, the encryption algorithm is limited by the `go-html-template` syntax

## Class FixItDecryptor API {#fixit-decryptor-api}

FixIt decryptor for encrypted pages

### new FixItDecryptor(options)

#### Parameters:

| Name    | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| options | Object | The options of FixItDecryptor（[Properties](#properties)） |

##### Properties:

| Name      | Type     | Attributes | Default | Description                                               |
| --------- | -------- | ---------- | ------- | --------------------------------------------------------- |
| decrypted | Function | \<optional\> |         | [Lifecycle Hooks] handler after decrypting                |
| reset     | Function | \<optional\> |         | [Lifecycle Hooks] handler after encrypting again          |
| duration  | Number   | \<optional\> | 86400   | number of seconds to cache decryption statistics. unit: s |

### Methods

#### init()

initialize FixIt decryptor

#### validateCache()

validate the cached decryption statistics in localStorage

#### addEventListener(event, listener)

add event listener for FixIt Decryptor

##### Parameters:

| Name     | Type     | Description   |
| -------- | -------- | ------------- |
| event    | String   | event name    |
| listener | Function | event handler |

#### removeEventListener(event, listener)

remove event listener for FixIt Decryptor

##### Parameters:

| Name     | Type     | Description   |
| -------- | -------- | ------------- |
| event    | String   | event name    |
| listener | Function | event handler |

### Events

#### decrypted

after decrypting

#### reset

after encrypting again