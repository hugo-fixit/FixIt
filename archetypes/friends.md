---
title: {{ replace .TranslationBaseName "-" " " | title }}
subtitle:
type: friends
date: {{ .Date }}
description: "{{ .Site.Author.name }}'s friends"
keywords:
  - 'Hugo FixIt'
  - 'friends template'
  - 友情链接
comment: false
---

<!-- When you set data `friends.yml` in `yourProject/data/` directory, it will be automatically loaded here. -->

---

<!-- You can define additional content below for this page. -->

## Base info

```yaml
- nickname: Lruihao
  avatar: https://lruihao.cn/images/avatar.jpg
  url: https://lruihao.cn
  description: Lruihao's Note
```

## Friendly Reminder

{{< admonition info "Notice" true >}}

1. If you want to exchange link, please leave a comment in the above format. (personal non-commercial blogs / websites only)
2. :(fa-solid fa-exclamation-triangle): Website failure, stop maintenance and improper content may be unlinked!
3. Those websites that do not respect other people's labor achievements, reprint without source, or malicious acts, please do not come to exchange.

{{< /admonition >}}
