---
title: Task List Rendering Test
date: 2026-02-28T08:54:02+08:00
collections:
  - Tests
categories:
  - Markdown
tags:
  - Task List
---

This post tests the rendering of task lists in Markdown.

<!--more-->

## Basic Task Lists

- [ ] Unchecked Task
- [x] Checked Task
- Regular list item

## Extended Task Lists (Custom Icons)

- [-] Cancelled Task
- [/] In Progress Task
- [<] Scheduled Task
- [>] Rescheduled Task
- [!] Important Task
- [!x] Important Checked Task
- [?] Question Task
- Regular list item

## Nested Task Lists (Bug Fix Verification)

- [ ] Parent Task 1
  - [ ] Child Task 1.1
  - [x] Child Task 1.2
  - Regular list item
- [/] Parent Task 2
  - Regular list item
  - [ ] Child Task 2.1
    - [x] Grandchild Task 2.1.1
    - [-] Grandchild Task 2.1.2
      - [<] Scheduled Task
      - [>] Rescheduled Task
      - [!] Important Task
      - [!x] Important Checked Task
      - [?] Question Task

## Mixed Content in List Items

- [ ] Task with **bold** and _italic_ text
- [x] Task with `inline code`
- [ ] Task with [some link](https://github.com/hugo-fixit/FixIt)
- [ ] Multi-line task
  that spans across multiple lines
  and still renders correctly as a single list item.
