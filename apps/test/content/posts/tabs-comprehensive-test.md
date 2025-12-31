---
title: Tabs Comprehensive Test Cases
date: 2025-09-09T10:00:00+08:00
collections:

- Tests
categories:
- Shortcodes
tags:
- Tabs
- UI Components
---

Testing various configurations and nested scenarios for the Tabs shortcode.

{{< tabs >}}
{{% tab title="Test Cases" %}}See Types section for various test cases.{{% /tab %}}
{{% tab title="Nested Tabs" %}}See Nested Tabs section for examples.{{% /tab %}}
{{< /tabs >}}

<!--more-->

## Types

### Underline (Default)

<!-- placement: top, bottom, left, right -->

{{< tabs placement="top" >}}
{{% tab title="Tab 1" %}}Content for underline style tab 1{{% /tab %}}
{{% tab title="Tab 2" %}}Content for underline style tab 2{{% /tab %}}
{{% tab title="Tab 3" %}}Content for underline style tab 3{{% /tab %}}
{{< /tabs >}}

### Pill

<!-- placement: top, bottom, left, right -->

{{< tabs type="pill" placement="top" >}}
{{% tab title="Tab 1" %}}Content for pill style tab 1{{% /tab %}}
{{% tab title="Tab 2" %}}Content for pill style tab 2{{% /tab %}}
{{% tab title="Tab 3" %}}Content for pill style tab 3{{% /tab %}}
{{< /tabs >}}

### Card

<!-- placement: top, bottom, left, right -->

{{< tabs type="card" placement="top" >}}
{{% tab title="Tab 1" %}}Content for card style tab 1{{% /tab %}}
{{% tab title="Tab 2" %}}Content for card style tab 2{{% /tab %}}
{{% tab title="Tab 3" %}}Content for card style tab 3{{% /tab %}}
{{< /tabs >}}

### Segment

{{< tabs type="segment" >}}
{{% tab title="Tab 1" %}}Content for segment style tab 1{{% /tab %}}
{{% tab title="Tab 2" %}}Content for segment style tab 2{{% /tab %}}
{{% tab title="Tab 3" %}}Content for segment style tab 3{{% /tab %}}
{{< /tabs >}}

## Nested Tabs

{{< tabs defaultTab=0 >}}

{{% tab title="Outer Tab 1" %}}
This is the first outer tab with simple content.

**Features:**

- Basic text content
- No nested components
- Simple layout
{{% /tab %}}

{{% tab title="Outer Tab 2" %}}
This outer tab contains nested tabs inside:

{{< tabs type="pill" defaultTab=1 >}}

{{% tab title="Inner A" %}}
Nested tab A content with **bold text** and _italic text_.

```javascript
console.log('Hello from nested tab A!')
```

{{% /tab %}}

{{% tab title="Inner B" %}}
Nested tab B content with a list:

1. First item
2. Second item
3. Third item

> This is a blockquote inside a nested tab.
{{% /tab %}}

{{% tab title="Inner C" %}}
Nested tab C with a table:

| Feature    | Status | Notes                  |
| :--------- | :----- | :--------------------- |
| Responsive | ✅     | Works on all devices   |
| Accessible | ✅     | Screen reader friendly |
| Fast       | ✅     | Optimized performance  |

{{% /tab %}}

{{< /tabs >}}

{{% /tab %}}

{{% tab title="Outer Tab 3" %}}
This tab contains vertical nested tabs:

{{< tabs type="card" vertical=true >}}

{{% tab title="Vertical A" %}}
Content for vertical nested tab A.

- Feature 1
- Feature 2
- Feature 3
{{% /tab %}}

{{% tab title="Vertical B" %}}
Content for vertical nested tab B.

```css
.example {
  color: #333;
  background: #f5f5f5;
  padding: 1rem;
}
```

{{% /tab %}}

{{< /tabs >}}

{{% /tab %}}

{{< /tabs >}}

## Others

### Mermaid Diagram inside Tabs

{{< tabs >}}
{{% tab title="Flowchart" %}}

```mermaid
flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]
```

{{% /tab %}}
{{% tab title="Gantt Chart" %}}

```mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
```

{{% /tab %}}
{{< /tabs >}}
