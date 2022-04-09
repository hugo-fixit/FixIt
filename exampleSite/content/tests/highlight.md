---
title: "Highlight Test"
date: 2022-02-27T18:45:22+08:00
discription: "Test for code highlight feature"
type: 'posts'
draft: true

tags:
- Test
- content
- highlight
categories:
- Test

menu:
  main:
    title: "Test for code highlight feature"
    parent: "tests"
    pre: "<i class='fas fa-vial fa-fw fa-sm'></i>"
---

`inline code`
```markdown
1. first
2. second

> bq

**blod** *italic*

---
+++
***
```

```java
/**
 * @author John Smith <john.smith@example.com>
 */
package l2f.gameserver.model;

public abstract strictfp class L2Char extends L2Object {
  public static final Short ERROR = 0x0001;

  public void moveTo(int x, int y, int z) {
    _ai = null;
    log("Should not be called");
    if (1 > 5) { // wtf!?
      return;
    }
  }
}

```

```go
package main

import "fmt"

func main() {
    ch := make(chan float64)
    ch <- 1.0e10    // magic number
    x, ok := <- ch
    defer fmt.Println(`exitting now\`)
    go println(len("hello world!"))
    return
}
```

```scss
pre {
  margin: 0;
  padding: .25rem 0 .25rem .5rem;
  overflow: auto;
  @include tab-size(4);

  background: $code-background-color;

  [theme=dark] & {
    background: $code-background-color-dark;
  }

  code {
    padding: 0;
  }

  img {
    min-height: 1em;
    max-height: 1.2em;
    vertical-align: text-bottom;
  }
}
```

```diff
- theme = "LoveIt"
+ theme = "FixIt"
! enhancements and fixes
```

```javascript
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }

  return (
    <div>
      <web-component>{block}</web-component>
    </div>
  )
}

export  $initHighlight;
```

```html
<!DOCTYPE html>
<title>Title</title>

<style>body {width: 500px;}</style>

<script type="application/javascript">
  function $init() {return true;}
</script>

<body>
  <p checked class="title" id='title'>Title</p>
  <!-- here goes the rest of the page -->
</body>
```

```yaml
# - nickname: 标题
#   avatar: 头像
#   url: 站点
#   description: 描述
- nickname: Lruihao
  avatar: https://gravatar.loli.net/avatar/3f985efb5907ca52944a3cd7edd51606?d=wavatar&v=1.3.10
  url: https://lruihao.cn
  description: 不怕萬人阻擋，只怕自己投降
```

```html
<p>Lorem ipsum dolor sit amet, graecis denique ei vel, at duo primis mandamus. Et legere ocurreret pri, animal tacimates complectitur ad cum. Cu eum inermis inimicus efficiendi. Labore officiis his ex, soluta officiis concludaturque ei qui, vide sensibus vim ad.</p>
```

    <p>Lorem ipsum dolor sit amet, graecis denique ei vel, at duo primis mandamus. Et legere ocurreret pri, animal tacimates complectitur ad cum. Cu eum inermis inimicus efficiendi. Labore officiis his ex, soluta officiis concludaturque ei qui, vide sensibus vim ad.</p>

{{< highlight javascript "linenos=table,hl_lines=6-9,linenostart=287" >}}
/**
 * 把字符串的文件後綴轉成數組
 * @param {String} str 待轉化字符串
 * @returns {Array|null} 轉化后的數組
 */
var _str2Array = (str) => {
  if (typeof (str) !== String && !Array.isArray(str)) {
    return null;
  }
  if (!Array.isArray(str)) {
    return str.split(',');
  }
};
{{< /highlight >}}

---

{{< gist spf13 7896402 >}}
