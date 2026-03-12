---
title: Code Tabs Test
date: 2026-01-25T07:50:22+08:00
collections:
  - Tests
categories:
  - Markdown
tags:
  - Code Tabs
---

Code tabs test cases for grouped code blocks.

<!--more-->

## Default Name

```python {group=tab2}
print("Python")
```

```go {group=tab2}
fmt.Println("Go")
```

## Custom Name

```js {group=tab-actions name="[JavaScript]"}
function sum(a, b) {
  return a + b
}

console.log(sum(1, 2))
```

```python {group=tab-actions name="[Python]"}
def sum(a, b):
  return a + b

print(sum(1, 2))
```

## Active Tab

```js {group=tab-active name="Inactive Tab"}
function greet(name) {
  return `Hello, ${name}!`
}
```

```python {group=tab-active name="Active Tab" .active}
def greet(name):
  return f"Hello, {name}!"
```

## Shadow

```js {group=tab-shadow name="Always" shadow="always"}
function greet(name) {
  return `Hello, ${name}!`
}
```

```python {group=tab-shadow name="Hover" shadow="hover"}
def greet(name):
  return f"Hello, {name}!"
```

```go {group=tab-shadow name="Never" shadow="never"}
func greet(name string) string {
  return fmt.Sprintf("Hello, %s!", name)
}
```

## Mode

```ts {group=tab-mode name="Classic"}
interface User {
  id: number
  name: string
}
```

```ts {group=tab-mode name="Mac" mode="mac"}
interface User {
  id: number
  name: string
}
```

```ts {group=tab-mode name="Simple" mode="simple"}
interface User {
  id: number
  name: string
}
```

## Actions

```bash {group=tab-actions name="lineNos=true" lineNos=true}
echo "line 1"
echo "line 2"
echo "line 3"
```

```bash {group=tab-actions name="lineNos=false" lineNos=false}
echo "line 1"
echo "line 2"
echo "line 3"
```

```bash {group=tab-actions name="wrapping" .line-wrapping}
printf "this is a very very very very very very very very very very very very very very very very long line"
```

```js {group=tab-actions name="editable" editable=true}
function greet(name) {
  return `Hello, ${name}!`
}
```

## Expanded/Collapsed

```js {group=tab-expand name="Expanded"}
function longFunction() {
  console.log('This is a long function.')
  console.log('It has many lines of code.')
  console.log('The code block should be expanded by default.')
  console.log('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
  console.log('Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')
  console.log('Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
  console.log('Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.')
  console.log('Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
  console.log('The end of the long function.')
}
```

```js {group=tab-expand name="Collapsed" .is-collapsed}
function shortFunction() {
  console.log('This is a short function.')
}
```

## Code tabs inside other blocks

> [!NOTE]+
>
> ```python {group=tab-nested}
> print("Python")
> ```
>
> ```go {group=tab-nested}
> fmt.Println("Go")
> ```

{{< details open=true >}}

```python {group=tab2}
print("Python")
```

```go {group=tab2}
fmt.Println("Go")
```

{{< /details >}}
