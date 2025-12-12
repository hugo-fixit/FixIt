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

## Multiple modes

```js
// Classic mode
function add(a, b) {
  return a + b
}
```

```js {mode="mac"}
// Mac mode
function add(a, b) {
  return a + b
}
```

```js {mode="simple"}
// Simple mode
function add(a, b) {
  return a + b
}
```

## Code title

```{title="Quine Clock"}
(r=()=>setInterval(t=>{for(j=o="\n",y=5;y--;document.body["inn"
+"erHTML"]="<pre>&lt"+(S="script>\n")+o+"\n\n&lt/"+S)for(x=-01;
63-!y>x++;o+=`(r=${r})()`[j++].fontcolor(c?'#FF0':"#444"))c=x/2
%4<3&&parseInt("odRFacb67o2vi5gmOZmwFNteohbOh3sw".slice(i="9"<(
D=Date()[16+(x/8|0)])?30:D*3,i+3),36)&1<<(x/2|0)%4+3*y},100))()
```

## Collapsed/Expanded

```
eval(z = 'p="<"+"pre>"/* ,.oq#+     ,._, */;for(y in n="zw24l6k\
4e3t4jnt4qj24xh2 x/* =<,m#F^    A W###q. */42kty24wrt413n243n\
9h243pdxt41csb yz/* #K       q##H######Am */43iyb6k43pk7243nm\
r24".split(4)){/* dP      cpq#q##########b, */for(a in t=pars\
eInt(n[y],36)+/*         p##@###YG=[#######y */(e=x=r=[]))for\
(r=!r,i=0;t[a/*         d#qg `*PWo##q#######D */]>i;i+=.05)wi\
th(Math)x-= /*        aem1k.com Q###KWR#### W[ */.05,0>cos(o=\
new Date/1e3/*      .Q#########Md#.###OP  A@ , */+x/PI)&&(e[~\
~(32*sin(o)*/* ,    (W#####Xx######.P^     T % */sin(.5+y/7))\
+60] =-~ r);/* #y    `^TqW####P###BP           */for(x=0;122>\
x;)p+="   *#"/* b.        OQ####x#K           */[e[x++]+e[x++\
]]||(S=("eval"/* l         `X#####D  ,       */+"(z=\'"+z.spl\
it(B = "\\\\")./*           G####B" #       */join(B+B).split\
(Q="\'").join(B+Q/*          VQBP`        */)+Q+")//m1k")[x/2\
+61*y-1]).fontcolor/*         TP         */(/\\w/.test(S)&&"#\
03B");document.body.innerHTML=p+=B+"\\n"}setTimeout(z)')//
```

````md
```lang {.is-collapsed}
// This code block will be collapsed by default.
```
````

````md
```lang {.is-expanded}
// This code block will be expanded regardless of its length.
```
````

## No wrapper

Set `wrapped=false` to disable code wrapper.

```js {wrapped=false}
function add(a, b) {
  return a + b
}
```

```js {wrapped=false, linenos=false}
function add(a, b) {
  return a + b
}
```

## linenos=false

```js {linenos=false}
function add(a, b) {
  return a + b
}
```

## lineNumbersInTable=false

> [!WARNING]
> Not recommended!

```js {lineNumbersInTable=false}
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

```js
<p>Lorem ipsum dolor sit amet, graecis denique ei vel, at duo primis mandamus. Et legere ocurreret pri, animal tacimates complectitur ad cum. Cu eum inermis inimicus efficiendi. Labore officiis his ex, soluta officiis concludaturque ei qui, vide sensibus vim ad.</p>
```

    <p>Lorem ipsum dolor sit amet, graecis denique ei vel, at duo primis mandamus. Et legere ocurreret pri, animal tacimates complectitur ad cum. Cu eum inermis inimicus efficiendi. Labore officiis his ex, soluta officiis concludaturque ei qui, vide sensibus vim ad.</p>

## Highlighting

Highlighting in code fences is enabled by default.

```js {linenostart=287,hl_lines=[2,"8-10"]}
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

{{< highlight javascript "hl_lines=2 8-10,linenostart=287" >}}
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
