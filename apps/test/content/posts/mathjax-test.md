---
title: MathJax Test
date: 2025-09-15T21:05:17+08:00
collections:
  - Tests
categories:
  - Markdown
tags:
  - Math
math:
  type: mathjax
  mathjax:
    macros:
      bold: ["{\\bf #1}", 1] # usage: $\bold{math}$
    loader:
      load: ["ui/safe", "[tex]/physics", "[custom]/xypic.js"]
      paths:
        custom: "https://cdn.jsdelivr.net/gh/sonoisa/XyJax-v3@3.0.1/build/"
    packages:
      "[+]": ["physics", "xypic"]
    tex:
      physics:
        italicdiff: false
        arrowdel: false
---

Testing MathJax rendering in FixIt theme.

<!--more-->

## Inline Formulas

$c = \pm\sqrt{a^2 + b^2}$ and \(f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi\)

## Formula Blocks

$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

\[ f(a) = \frac{1}{2\pi i} \oint\frac{f(z)}{z-a}dz \]

$$
\cos(\theta+\phi)=\cos(\theta)\cos(\phi)−\sin(\theta)\sin(\phi)
$$

\[
\int_D ({\nabla\cdot} F)dV=\int_{\partial D} F\cdot ndS
\]

$$
\vec{\nabla} \times \vec{F} =
            \left( \frac{\partial F_z}{\partial y} - \frac{\partial F_y}{\partial z} \right) \mathbf{i}
          + \left( \frac{\partial F_x}{\partial z} - \frac{\partial F_z}{\partial x} \right) \mathbf{j}
          + \left( \frac{\partial F_y}{\partial x} - \frac{\partial F_x}{\partial y} \right) \mathbf{k}
$$

$$
\sigma = \sqrt{ \frac{1}{N} \sum_{i=1}^N (x_i -\mu)^2}
$$

$$
(\nabla_X Y)^k = X^i (\nabla_i Y)^k =
           X^i \left( \frac{\partial Y^k}{\partial x^i} + \Gamma_{im}^k Y^m \right)
$$

## Chemical Equations

$$C_p[\ce{H2O(l)}] = \pu{75.3 J // mol K}$$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$

$$C_p[\ce{H2O(l)}] = \pu{75.3 J // mol K}$$

## Custom Macros

$\bold{Custom}$ macro $\KaTeX$ in $\text{MathJax}$

$$
\def\RR{{\bf R}}
\def\bolda#1{{\bf #1}}
\RR = \bolda{R}
$$

$$
\newcommand{\water}{{\rm H_{2}O}}
\water = \text{H}_2\text{O}
$$

$$
\newcommand{\hello}[1][World]{Hello, #1!}
\hello \quad \hello[FixIt]
$$

$$
\let\oldphi=\phi
\let\oldtheta=\theta
\renewcommand{\phi}{\varphi}
\renewcommand{\theta}{\vartheta}
\phi, \oldphi, \theta, \oldtheta
$$

## Custom Extensions

A `physics` package example:

$$
\mqty(a & b \\ c & d) = \begin{pmatrix} a & b \\ c & d \end{pmatrix}
$$

An `xypic` package example:

$$
\begin{xy}
\xymatrix {
U \ar@/_/[ddr]_y \ar@{.>}[dr]|{\langle x,y \rangle} \ar@/^/[drr]^x \\
 & X \times_Z Y \ar[d]^q \ar[r]_p & X \ar[d]_f \\
 & Y \ar[r]^g & Z
}
\end{xy}
$$
