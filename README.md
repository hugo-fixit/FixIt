# FixIt Theme | Hugo

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/hugo-fixit/FixIt?style=flat)](https://github.com/hugo-fixit/FixIt/releases)
[![Hugo](https://img.shields.io/badge/Hugo-%5E0.109.0-ff4088?style=flat&logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/github/license/hugo-fixit/FixIt?style=flat)](/LICENSE)

👉 English README | [简体中文说明](README.zh-cn.md)

> [FixIt](https://github.com/hugo-fixit/FixIt) is a **clean**, **elegant** but **advanced** blog theme for [Hugo](https://gohugo.io/).

It is based on the original [LoveIt Theme](https://github.com/dillonzq/LoveIt), [KeepIt Theme](https://github.com/Fastbyte01/KeepIt) and [LeaveIt Theme](https://github.com/liuzc/LeaveIt).

The FixIt theme inherits the excellent features of these themes, and adds new features and optimizations on those basis. Please read [Why Choose FixIt](#why-choose-fixit) to learn more.

![Hugo Theme FixIt](https://fixit.lruihao.cn/images/Apple-Devices-Preview.jpg)

## Getting started

Head to the [getting started page](http://fixit.lruihao.cn/documentation/getting-started/) or start with a template:

* [hugo-fixit/hugo-fixit-blog-git](https://github.com/hugo-fixit/hugo-fixit-blog-git)
* [hugo-fixit/hugo-fixit-blog-go](https://github.com/hugo-fixit/hugo-fixit-blog-go)

## [Documentation](https://fixit.lruihao.cn/categories/documentation/)

Head to this [documentation page](https://fixit.lruihao.cn/documentation/basics/) for a complete guidence to get started with the FixIt theme.

Or run [Documentation Site](https://fixit.lruihao.cn) locally, see more details from [Contributing](#contributing).

In addition, there is the [FixIt wiki](https://github.com/hugo-fixit/FixIt/wiki).

## Migrate from LoveIt

If you are currently using the LoveIt theme (or some other themes), it is very easy to migrate to FixIt.

You can add this repo as a submodule of your site directory. Alternatively, you can install the theme in [other ways](https://fixit.lruihao.cn/documentation/basics/#install-theme).

```bash
git submodule add https://github.com/hugo-fixit/FixIt.git themes/FixIt
```

And later you can update the submodule in your site directory to the latest commit using this command:

```bash
git submodule update --remote --merge
```

Next, go to the `config.toml` and change the default theme to `FixIt`.

```diff
- theme = "LoveIt"
+ theme = "FixIt"
```

Now the migration is finished and everything is ready 🎉

## Why choose FixIt

The FixIt theme inherits the excellent features of themes such as LoveIt, and adds new features and optimizations on those basis, as detailed in [Features](#features). In addition, the FixIt theme has the following advantages:

* Complete Chinese and English official documentations
* Community support: Theme official website, Discussions and official QQ group
* Continuously and actively update
* Constantly incorporate suggestions and ideas from all sides
* Highly open theme customizable section

In short, if you prefer the design language and freedom of the FixIt theme, and if you like to personalize your own themes as I do, the FixIt theme may be more suitable for you.

## Who used FixIt

To see this theme in action, here are some [live demo sites](https://fixit.lruihao.cn/friends/) which are rendered with **FixIt** theme.

## Features

### Performance and SEO

* Optimized for **performance**: 99/100 on mobile and 100/100 on desktop in [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights)
* Optimized SEO performance with a correct **SEO SCHEMA** based on JSON-LD
* **[Google Analytics](https://analytics.google.com/analytics)** supported
* **[Fathom Analytics](https://usefathom.com/)** supported
* Search engine **verification** supported (Google, Bing, Yandex, Pinterest, Baidu, 360 and Sogou)
* **CDN** for third-party libraries supported

### Appearance and Layout

* **Responsive** layout
* **Light/Dark** mode
* Globally consistent **design language**
* **Pagination** supported
* Easy-to-use and self-expanding **table of contents**
* **Multilanguage** supported and i18n ready
* Beautiful **CSS animation**

### Social and Comment Systems

* **Gravatar** supported by [Gravatar](https://gravatar.com)
* Local **Avatar** supported
* Up to **87** social links supported
* Up to **28** share sites supported
* **Disqus** comment system supported by [Disqus](https://disqus.com)
* **Gitalk** comment system supported by [Gitalk](https://github.com/gitalk/gitalk)
* **Valine** comment system supported by [Valine](https://valine.js.org/)
* **Waline** comment system supported by [Waline](https://waline.js.org/)
* **Facebook comments** system supported by [Facebook](https://developers.facebook.com/docs/plugins/comments/)
* **Telegram comments** system supported by [Telegram Comments](https://comments.app/)
* **Commento** comment system supported by [Commento](https://commento.io/)
* **Utterances** comment system supported by [Utterances](https://utteranc.es/)
* **Artalk** comment system supported by [Artalk](https://artalk.js.org/)
* **Twikoo** comment system supported by [Twikoo](https://twikoo.js.org/)
* **giscus** comment system supported by [giscus](https://giscus.app/)

### Extended Features

* **PWA (Progressive Web App)** supported
* **Sub Menu** supported
* **Content Encryption** supported (Pages, Partial)
* **Friends** page embedded template
* **Search** supported by [Lunr.js](https://lunrjs.com/) or [algolia](https://www.algolia.com/) or [Fuse.js](https://fusejs.io/)
* **Twemoji** supported
* Automatically **highlighting** code
* **Copy code** to clipboard with one click
* **Images gallery** supported by [lightgallery](https://github.com/sachinchoolur/lightgallery)
* Extended Markdown syntax for **[Font Awesome](https://fontawesome.com/) icons**
* Extended Markdown syntax for **ruby annotation**
* Extended Markdown syntax for **fraction**
* **Mathematical formula** supported by [KaTeX](https://katex.org/)
* **Diagrams** shortcode supported by [mermaid](https://github.com/knsv/mermaid)
* **Interactive data visualization** shortcode supported by [ECharts](https://echarts.apache.org/)
* **Mapbox** shortcode supported by [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* **Music player** shortcode supported by [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS)
* **Bilibili player** shortcode
* Kinds of **admonitions** shortcode
* **Custom style** shortcode
* **Custom script** shortcode
* **Animated typing** supported by [TypeIt](https://typeitjs.com/)
* **Cookie consent banner** supported by [cookieconsent](https://github.com/osano/cookieconsent)
* **Web Watermark** supported by [cell-watermark](https://github.com/Lruihao/watermark)
* **Chinese typesetting** supported by [pangu.js](https://github.com/vinta/pangu.js)
* ...

## Multilingual and i18n

FixIt supports the following languages:

* English
* Simplified Chinese
* Traditional Chinese
* French
* Polish
* Brazilian Portuguese
* Italian
* Spanish
* German
* Serbian
* Russian
* Romanian
* Vietnamese
* [Contribute with a new language](https://github.com/hugo-fixit/FixIt/pulls)

[Languages Compatibility](https://fixit.lruihao.cn/documentation/basics/#language-compatibility)

## [Roadmap](https://github.com/hugo-fixit/FixIt/projects/1)

## [Changelog](/CHANGELOG.md)

## Questions, ideas, bugs, pull requests

All feedback is welcome! Head over to the [issues](https://github.com/hugo-fixit/FixIt/issues) or [discussions](https://github.com/hugo-fixit/FixIt/discussions) tracker.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for getting started with the contribution.

Make sure that you follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) while contributing and engaging in the discussions.

**When contributing, please first discuss the change you wish to make via an issue on this repository before making the actual change**.

## [Contributors](contributors.md)

## Acknowledgements

<details open>
<summary>Thanks to the authors of following resources included in the theme:</summary>

* [normalize.css](https://github.com/necolas/normalize.css)
* [Font Awesome](https://fontawesome.com/)
* [Simple Icons](https://github.com/simple-icons/simple-icons)
* [Animate.css](https://daneden.github.io/animate.css/)
* [autocomplete-js](https://github.com/algolia/autocomplete)
* [Lunr.js](https://lunrjs.com/)
* [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript)
* [Fuse.js](https://fusejs.io/)
* [object-fit-images](https://github.com/fregante/object-fit-images)
* [Twemoji](https://github.com/twitter/twemoji)
* [emoji-data](https://github.com/iamcal/emoji-data)
* [lightgallery](https://github.com/sachinchoolur/lightgallery)
* [Sharer.js](https://github.com/ellisonleao/sharer.js)
* [TypeIt](https://typeitjs.com/)
* [KaTeX](https://katex.org/)
* [mermaid](https://github.com/mermaid-js/mermaid)
* [ECharts](https://echarts.apache.org/)
* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* [APlayer](https://github.com/MoePlayer/APlayer)
* [MetingJS](https://github.com/metowolf/MetingJS)
* [Gitalk](https://github.com/gitalk/gitalk)
* [Valine](https://valine.js.org/)
* [cookieconsent](https://github.com/osano/cookieconsent)
* [cell-watermark](https://github.com/Lruihao/watermark)
* [不蒜子](http://busuanzi.ibruce.info/)
* [pangu.js](https://github.com/vinta/pangu.js)
* [Artalk](https://artalk.js.org/)
* [Waline](https://waline.js.org/)
* [Twikoo](https://twikoo.js.org/)
* [github-corners](https://github.com/tholman/github-corners)
* [giscus](https://giscus.app/)
* [crypto-js](https://github.com/brix/crypto-js)
* [vConsole](https://github.com/Tencent/vConsole)
* [eruda](https://github.com/liriliri/eruda)
* [pace](https://github.com/CodeByZach/pace)

</details>

<details open>
<summary>The FixIt also draws on some features of the following projects, and thanks to their authors as well:</summary>

* [DoIt](https://github.com/HEIGE-PCloud/DoIt)
* [NexT](https://github.com/next-theme/hexo-theme-next)

</details>

## License

FixIt is licensed under the **MIT** license. Check the [LICENSE file](LICENSE) for details.

## Author

[Lruihao](https://github.com/Lruihao "Follow me on GitHub")

## Sponsor

Giving me a Star 🌟 is already the greatest encouragement and support for me.\
If you enjoy the theme, please consider buying me a coffee ☕️.

* [PayPal](https://paypal.me/Lruihao)
* [Alipay](images/alipay.jpg)
* [Wechat](images/wechatpay.jpg)

Thanks! ❤️
