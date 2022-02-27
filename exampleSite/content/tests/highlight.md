---
title: "Highlight Code"
date: 2022-02-27T18:45:22+08:00
type: 'posts'
draft: true
---

`inline code`

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

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
```

```diff
- theme = "LoveIt"
+ theme = "FixIt"
```

```javascript
grunt.initConfig({
  assemble: {
    options: {
      assets: 'docs/assets',
      data: 'src/data/*.{json,yml}',
      helpers: 'src/custom-helpers.js',
      partials: ['src/partials/**/*.{hbs,md}']
    },
    pages: {
      options: {
        layout: 'default.hbs'
      },
      files: {
        './': ['src/templates/pages/index.hbs']
      }
    }
  }
};
```

    ▸ .github/       # GitHub configuration
    ▸ _scripts/      # shell commands for hugo project, entrance: hugo_main.sh
    ▸ archetypes/    # page archetypes (like scaffolds of archetypes)
    ▸ assets/        # css, js, third-party libraries etc.
    ▸ content/       # blog source of hugo project
    ▸ data/          # blog data (allow: yaml, json, toml), e.g. friends.yml
    ▸ i18n/          # i18n translation documents
    ▸ layouts/       # page layouts source
    ▸ public/        # build directory
    ▸ static/        # static files, e.g. favicon.ico
    ▸ themes/        # theme submodules
      config.toml    # configuration of hugo project (like _config.yml of hexo)

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

---

{{< gist spf13 7896402 >}}
