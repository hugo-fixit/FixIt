---
title: KaTeX Test
date: 2025-09-15T21:05:17+08:00
collections:
  - Tests
categories:
  - Markdown
tags:
  - Math
---

Testing $\KaTeX$ rendering in FixIt theme.

<!--more-->

## Inline Formulas

$c = \pm\sqrt{a^2 + b^2}$ and \(f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi\)

## Formula Blocks

$$ c = \pm\sqrt{a^2 + b^2} $$

\[f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi\]

$$
\begin{equation*}
  \rho \frac{\mathrm{D} \mathbf{v}}{\mathrm{D} t}=\nabla \cdot \mathbb{P}+\rho \mathbf{f}
\end{equation*}
$$

$$
\begin{equation}
  \mathbf{E}=\sum_{i} \mathbf{E}\_{i}=\mathbf{E}\_{1}+\mathbf{E}\_{2}+\mathbf{E}_{3}+\cdots
\end{equation}
$$

$$
\begin{align}
  a&=b+c \\
  d+e&=f
\end{align}
$$

$$
\begin{alignat}{2}
   10&x+&3&y = 2 \\
   3&x+&13&y = 4
\end{alignat}
$$

$$
\begin{gather}
   a=b \\
   e=b+c
\end{gather}
$$

$$
\begin{CD}
   A @>a>> B \\
@VbVV @AAcA \\
   C @= D
\end{CD}
$$

## Chemical Equations

$$ \ce{CO2 + C -> 2 CO} $$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$

$$C_p[\ce{H2O(l)}] = \pu{75.3 J // mol K}$$
