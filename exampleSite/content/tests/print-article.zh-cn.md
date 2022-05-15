---
title: "重新认识 JavaScript"
subtitle: "学习 JavaScript 新特性"
date: 2022-05-01T10:59:36+08:00
description: "这是一篇测试 FixIt 主题在打印视图表现的测试文章"
type: 'posts'
draft: true

tags:
- Test
- print
- JavaScript
- ES6
categories:
- Test

code:
  maxShownLines: 30

menu:
  main:
    name: "打印测试"
    title: "这是一篇测试 FixIt 主题在打印视图表现的测试文章"
    parent: "tests"
    pre: "<i class='fas fa-vial fa-fw fa-sm'></i>"
---

<div class="print-d-none">

> **这是一篇测试 FixIt 主题在打印视图表现的测试文章。所有居中的说明文字将不会出现在打印视图。**
> 
> 按 <kbd>ctrl</kbd> + <kbd>P</kbd> 或者 <kbd>⌘</kbd> + <kbd>P</kbd> 可以打印此页面。
>
> FR: <https://lruihao.cn/posts/js-rediscover/>


</div>

{{< admonition tip "前言" >}}

前端框架轮替变化越来越快，JavaScript 也在不断地升级迭代，越来越多的新特性让我们的代码写起来变得简洁有趣。

每隔一段时间就该重新认识一下 JS，这篇文章会介绍 6 种新特性，一起研究一下吧。

{{< /admonition >}}

<!--more-->

## 数组方法 some, every, find, filter

> 共同点：这几个方法都不会改变原始数组。

**[some](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)**

`some()` 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试，它返回一个布尔值。

数组中有至少一个元素通过回调函数的测试就会返回 `true`，所有元素都没有通过回调函数的测试返回值才会为 `false`。

```
arr.some(callback(element[, index[, array]])[, thisArg])
```

```js
[2, 5, 8, 1, 4].some(x => x > 10); // false
[12, 5, 8, 1, 4].some(x => x > 10); // true
```

{{< admonition tip >}}

`some()` 不会对空数组进行检测，空数组返回 `false`

{{< /admonition >}}

**[every](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)**

> 助记：`every()` 和 `some()` 功能相反

`every()` 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试，它返回一个布尔值。

<small class="text-center print-d-none">

*在这个位置使用 `page-break-before` 进行了强制分页*

</small>
<div class="page-break-before"></div>

如果回调函数的每一次返回都为 [truthy](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy) 值，返回 `true` ，否则返回 `false`。

```
arr.every(callback(element[, index[, array]])[, thisArg])
```

```js
[12, 5, 8, 130, 44].every(x => x >= 10); // false
[12, 54, 18, 130, 44].every(x => x >= 10); // true
```

{{< admonition tip >}}

`every()` 不会对空数组进行检测，空数组返回 `true`

{{< /admonition >}}

**[Find](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find)**

> 助记：功能和 `some()` 类似，`some()` 返回布尔值，`find()` 返回**找到**的元素

 `find()` 方法返回数组中满足提供的测试函数的第一个元素的值，否则返回 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

```
arr.find(callback[, thisArg])
```

```js
const array1 = [5, 12, 8, 130, 44];

const found = array1.find(element => element > 10);

console.log(found);
// expected output: 12
```

{{< admonition quote >}}

另请参见 [`findIndex()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) 方法，它返回数组中找到的元素的索引，而不是其值。

如果你需要找到一个元素的位置或者一个元素是否存在于数组中，使用 [`Array.prototype.indexOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf) 或 [`Array.prototype.includes()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)。

{{< /admonition >}}

**[filter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)**

> 助记：如字面意思，它是一个筛子，会筛选出满足条件的元素

`filter()` 方法创建一个新数组，其包含通过所提供函数实现的测试的所有元素。

<small class="text-center print-d-none">

*在这个位置使用 `page-break-after` 进行了强制分页*

</small>
<div class="page-break-after"></div>

返回值是一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

```
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

```js
const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter(word => word.length > 6);

console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]
```

## 使用 `Object.hasOwn` 替代 `in` 操作符

有时，我们想知道对象上是否存在某个属性，一般会使用 `in` 操作符或 `obj.hasOwnProperty`，但它们都有各自的缺陷。

**in**

如果指定的属性位于对象或其原型链中，`in` 运算符将返回 `true`。

```javascript
const Person = function (age) {
  this.age = age
}
Person.prototype.name = 'fatfish'

const p1 = new Person(24)
console.log('age' in p1) // true
console.log('name' in p1) // true  注意这里
```

**obj.hasOwnProperty**

`hasOwnProperty` 方法会返回一个布尔值，表示对象**自身属性**中是否具有对应的值（原型链上的属性不会读取）。

```javascript
const Person = function (age) {
  this.age = age
}
Person.prototype.name = 'fatfish'

const p1 = new Person(24)
console.log(p1.hasOwnProperty('age')) // true
console.log(p1.hasOwnProperty('name')) // fasle  注意这里
```

<small class="text-center print-d-none">

*在这个位置使用 `page-break-after` 进行了强制分页*

</small>
<div class="page-break-after"></div>

`obj.hasOwnProperty` 已经可以过滤掉原型链上的属性，但在某些情况下，它还是不安全。

```javascript
Object.create(null).hasOwnProperty('name')
// Uncaught TypeError: Object.create(...).hasOwnProperty is not a function
```

**Object.hasOwn**

别急，我们可以使用 `Object.hasOwn` 来避免这两个问题，这比 `obj.hasOwnProperty` 方法更加方便、安全。

```javascript
let object = { age: 24 }
Object.hasOwn(object, 'age') // true

let object3 = Object.create(null)
Object.hasOwn(object3, 'age') // false
```

## 使用 "#" 声明私有属性

以前，我们一般用 `_` 表示私有属性，但它并不靠谱，还是会被外部修改。

```javascript
class Person {
  constructor (name) {
    this._money = 1
    this.name = name
  }
  get money () {
    return this._money
  }
  set money (money) {
    this._money = money
  }
  showMoney () {
    console.log(this._money)
  }
}
const p1 = new Person('fatfish')
console.log(p1.money) // 1
console.log(p1._money) // 1
p1._money = 2 // 依旧可以从外部修改_money 属性，所以这种做法并不安全
console.log(p1.money) // 2
console.log(p1._money) // 2
```

<small class="text-center print-d-none">

*在这个位置使用 `page-break-after` 进行了强制分页*

</small>
<div class="page-break-after"></div>

**使用 `#` 实现真正私有属性**

```javascript
class Person {
  #money=1
  constructor (name) {
    this.name = name
  }
  get money () {
    return this.#money
  }
  set money (money) {
    this.#money = money
  }
  showMoney () {
    console.log(this.#money)
  }
}
const p1 = new Person('fatfish')
console.log(p1.money) // 1
// p1.#money = 2 // 没法从外部直接修改
p1.money = 2
console.log(p1.money) // 2
console.log(p1.#money) // Uncaught SyntaxError: Private field '#money' must be declared in an enclosing class
```

## 有用的数字分隔符

可以使用 `_` 分隔数字，当然也可以用于计算

```javascript
// ✅ 更加易于阅读
const newSixBillion = 6000_000_000
// ❌ 难以阅读
const originSixBillion = 6000000000

console.log(newSixBillion === originSixBillion)
// expected output: true
```

```javascript
const sum = 1000 + 6000_000_000
// expected output: 6000001000
```

{{< admonition tip >}}

另外，我们写时间时，`24*60*60*1000` 的可读性也是远大于 `86400000` 的。

{{< /admonition >}}

<small class="text-center print-d-none">

*在这个位置使用 `page-break-after` 进行了强制分页*

</small>
<div class="page-break-after"></div>

## "?.", "??", "??=" 的使用

**可选链 ?.**

以前我们为了简化 `if else`，通常会写出这样的代码

```js
const obj = null
console.log(obj && obj.name)

const $title = document.querySelector('.title')
const title = $title ? title.innerText : undefined
```

使用 `?.` 简化 `&&` 和三元运算符

```js
const obj = null
console.log(obj?.name)

const $title = document.querySelector('.title')
const title = $title?.innerText
```

**空值合并运算符 ??**

之前给变量赋默认值时，我们一般会用 `||` 来写，比如

```js
let foo = 1
let bar = foo || 2
console.log(bar) // 1

let foo = 0
let bar = foo || 2
console.log(bar) // 2 注意这里
```

所以，`||` 有时候并不是很安全，所以我们不得不加判断

```js
let foo = 0
let bar = foo !== undefined ? foo : 2
console.log(bar) // 0
```

<small class="text-center print-d-none">

*在这个位置使用 `page-break-after` 进行了强制分页*

</small>
<div class="page-break-after"></div>

现在使用 `??` 可以使代码更加优雅

```js
let foo = 1
let bar = foo ?? 2
console.log(bar) // 1

let foo = 0
let bar = foo ?? 2
console.log(bar) // 0
```

**空值赋值运算符 ??=**

```js
let foo = 0
foo ??= 2
console.log(foo) // 0

let foo = 1
foo ??= 2
console.log(foo) // 1
```

很好理解，这里的 `foo ??= 2` 等价于 `foo = foo ?? 2`

<small class="text-center print-d-none">

*在这个位置使用 `page-break-after` 进行了强制分页*

</small>
<div class="page-break-after"></div>

## 使用 BigInt 支持大数计算

JS 中超过 `Number.MAX_SAFE_INTEGER` 的数字计算将是不安全的。

**Example:**

```javascript
Math.pow(2, 53) === Math.pow(2, 53) + 1 // true
// Math.pow(2, 53) => 9007199254740992
// Math.pow(2, 53) + 1 => 9007199254740992
```

使用 `BigInt` 完全可以避免这个问题

```javascript
BigInt(Math.pow(2, 53)) === BigInt(Math.pow(2, 53)) + BigInt(1) // false
// BigInt(Math.pow(2, 53)) => 9007199254740992n
// BigInt(Math.pow(2, 53)) + BigInt(1) => 9007199254740993n
```

要创建一个 BigInt，可以在一个整数的末尾添加字符`n`，或者调用函数 `BigInt()`。

```js
let foo = BigInt(1) // 1n
let bar = BigInt(2) // 2n
console.log(foo > bar) // false

console.log(1n > 2n) // false
```

*学无止境，与未来的自己共勉*