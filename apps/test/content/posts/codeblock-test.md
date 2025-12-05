---
title: Code Block Test
date: 2025-11-28T15:16:35+08:00
collections:
  - Tests
categories:
  - Markdown
tags:
  - Code Block
---
Testing code block in FixIt theme.

<!--more-->
<!-- markdownlint-disable-file blanks-around-lists ul-style ul-indent code-block-style -->

```fixit
🎉🥚 in development mode!
```

## Code title

```js {title="test.js"}
console.log('hello FixIt!')
```

## No Header

```js {wrapped=false}
function add(a, b) {
  return a + b
}
```

## Diff Code

```diff
- theme = "LoveIt"
+ theme = "FixIt"
! enhancements and fixes
```

## Long Code

```html
<p>Lorem ipsum dolor sit amet, graecis denique ei vel, at duo primis mandamus. Et legere ocurreret pri, animal tacimates complectitur ad cum. Cu eum inermis inimicus efficiendi. Labore officiis his ex, soluta officiis concludaturque ei qui, vide sensibus vim ad.</p>
```

    <p>Lorem ipsum dolor sit amet, graecis denique ei vel, at duo primis mandamus. Et legere ocurreret pri, animal tacimates complectitur ad cum. Cu eum inermis inimicus efficiendi. Labore officiis his ex, soluta officiis concludaturque ei qui, vide sensibus vim ad.</p>

## Highlighting

Highlighting in code fences is enabled by default.

```js {linenos=table,linenostart=287,hl_lines=[2,"8-10"]}
/**
 * check if a string is a JS object string
 * @example isObjectLiteral("{a:1,b:2}") // true
 * @param {string} str string to check
 * @returns {boolean} whether the string is a JS object string
 */
function isObjectLiteral(str) {
  if (typeof str !== 'string') {
    return false
  }
  str = str.replace(/\s+/g, ' ').trim().replace(/;$/, '')
  if (str.startsWith('{') && str.endsWith('}')) {
    return true
  }
  return false
}
```

Highlighting in shortcode highlight.

{{< highlight javascript "linenos=table,hl_lines=2 8-10,linenostart=287" >}}
/**
 * check if a string is a JS object string
 * @example isObjectLiteral("{a:1,b:2}") // true
 * @param {string} str string to check
 * @returns {boolean} whether the string is a JS object string
 */
function isObjectLiteral(str) {
  if (typeof str !== 'string') {
    return false
  }
  str = str.replace(/\s+/g, ' ').trim().replace(/;$/, '')
  if (str.startsWith('{') && str.endsWith('}')) {
    return true
  }
  return false
}
{{< /highlight >}}

## Gist Embed

{{< gist Lruihao fb8b2d0353465c4d40bf74818db80710 >}}
