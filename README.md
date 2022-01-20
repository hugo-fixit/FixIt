# FixIt 主题 | Hugo

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/Lruihao/FixIt?style=flat-square)](https://github.com/Lruihao/FixIt/releases)
[![GitHub commits since tagged version](https://img.shields.io/github/commits-since/Lruihao/FixIt/v0.2.10?style=flat-square)](https://github.com/Lruihao/FixIt/compare/v0.2.10...master)
[![Hugo](https://img.shields.io/badge/Hugo-%5E0.62.0-ff4088?style=flat-square&logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/github/license/Lruihao/FixIt?style=flat-square)](https://github.com/Lruihao/FixIt/blob/master/LICENSE)

English README | [简体中文说明](https://github.com/Lruihao/FixIt/blob/main/README.zh-cn.md)

> **FixIt** is a **clean**, **elegant** but **advanced** blog theme for [Hugo](https://gohugo.io/).

It is based on the original [LoveIt Theme](https://github.com/dillonzq/LoveIt), [LeaveIt Theme](https://github.com/liuzc/LeaveIt) and [KeepIt Theme](https://github.com/Fastbyte01/KeepIt).

[LoveIt Theme](https://github.com/dillonzq/LoveIt) is a awesome hugo theme for us, I'm sorry that it's repository has been out of maintenance for a long time, so I rebuilt a new fork named FixIt so that I can better **Fix It** and make it more user-friendly.

The FixIt theme inherits the excellent functions of these themes, and adds new functions and optimizations on this basis. Please read [Why Choose FixIt](#why-choose-fixit) to learn more.

![Hugo Theme FixIt](https://github.com/Lruihao/FixIt/raw/master/images/Apple-Devices-Preview.png)

## Getting started
<!-- TODO update url -->
Head to this [documentation page](https://hugofixit.pages.dev/theme-documentation-basics/) for a complete guidence to get started with the FixIt theme.

### [Demo Site](https://lruihao.cn)
<!-- TODO update url -->
To see this theme in action, here is a live [demo site](https://lruihao.cn) which is rendered with **FixIt** theme.

### [Documentation](https://hugofixit.pages.dev/categories/documentation/)
<!-- TODO update url -->
Build Documentation Locally:

```bash
hugo server --source=exampleSite
```

Of course, you can also watch the [FixIt wiki](https://github.com/Lruihao/FixIt/wiki) directly.

## Migrate from LoveIt

If you are currently using the LoveIt theme (or some other themes), it is very easy to migrate to FixIt.

You can add this repo as a submodule of your site directory.

```bash
git submodule add https://github.com/Lruihao/FixIt.git themes/FixIt
```

And later you can update the submodule in your site directory to the latest commit using this command:

```bash
git submodule update --remote --merge
```

Or use shell command `fixit_checker.sh` to update and commit in the theme directory.

```bash
sh fixit_checker.sh
```

Next, go to the `config.toml` and change the default theme to `FixIt`.

```diff
- theme = "LoveIt"
+ theme = "FixIt"
```

Now the migration is finished and everything is ready 🎉

## Why choose FixIt

* Custom **Header**
* Custom **CSS Style**
* A new **home page**, compatible with the latest version of Hugo
* A lot of **style detail adjustments,** including color, font size, margins, code preview style
* More readable **dark mode**
* Some beautiful **CSS animations**
* Easy-to-use and self-expanding **table of contents**
* More **social links**, **share sites** and **comment system**
* **Search** supported by [Lunr.js](https://lunrjs.com/) or [algolia](https://www.algolia.com/)
* **Copy code** to clipboard with one click
* Extended Markdown syntax for **[Font Awesome](https://fontawesome.com/) icons**
* Extended Markdown syntax for **ruby annotation**
* Extended Markdown syntax for **fraction**
* **Mathematical formula** supported by [KaTeX](https://katex.org/)
* **Diagram syntax** shortcode supported by [mermaid](https://github.com/knsv/mermaid)
* **Interactive data visualization** shortcode supported by [ECharts](https://echarts.apache.org/)
* **Mapbox** shortcode supported by [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* Embedded **music player** supported by [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS)
* **Bilibili** player supported
* Kinds of **admonitions** shortcode supported
* Custom style shortcodes supported
* **CDN** for all third-party libraries supported
* **PWA (Progressive Web App)** supported
* **Web Watermark** supported by [Watermark](https://github.com/Lruihao/watermark)
* **Chinese typesetting** supported by [pangu.js](https://github.com/vinta/pangu.js)
* **Card type** link shortcode
* **Friends** page embedded template
* ...

In short,  
if you prefer the design language and freedom of the FixIt theme,  
if you want to use the extended Font Awesome icons conveniently,  
if you want to embed mathematical formulas, flowcharts, music or Bilibili videos in your posts,  
the FixIt theme may be more suitable for you.  

## Features

### Performance and SEO

* Optimized for **performance**: 99/100 on mobile and 100/100 on desktop in [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights)
* Optimized SEO performance with a correct **SEO SCHEMA** based on JSON-LD
* **[Google Analytics](https://analytics.google.com/analytics)** supported
* **[Fathom Analytics](https://usefathom.com/)** supported
* Search engine **verification** supported (Google, Bind, Yandex and Baidu)
* **CDN** for third-party libraries supported
* Automatically converted images with **Lazy Load** by [lazysizes](https://github.com/aFarkas/lazysizes)

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
* Up to **64** social links supported
* Up to **28** share sites supported
* **Disqus** comment system supported by [Disqus](https://disqus.com)
* **Gitalk** comment system supported by [Gitalk](https://github.com/gitalk/gitalk)
* **Valine** comment system supported by [Valine](https://valine.js.org/)
* **Facebook comments** system supported by [Facebook](https://developers.facebook.com/docs/plugins/comments/)
* **Telegram comments** system supported by [Telegram Comments](https://comments.app/)
* **Commento** comment system supported by [Commento](https://commento.io/)
* **Utterances** comment system supported by [Utterances](https://utteranc.es/)

### Extended Features

* **Search** supported by [Lunr.js](https://lunrjs.com/) or [algolia](https://www.algolia.com/)
* **Twemoji** supported
* Automatically **highlighting** code
* **Copy code** to clipboard with one click
* **Images gallery** supported by [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js)
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
* **PWA (Progressive Web App)** supported
* **Web Watermark** supported by [Watermark](https://github.com/Lruihao/watermark)
* **Chinese typesetting** supported by [pangu.js](https://github.com/vinta/pangu.js)
* **Card type** link shortcode
* **Friends** page embedded template
* ...

## Multilingual and i18n

FixIt supports the following languages:

* English
* Simplified Chinese
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
* Traditional Chinese
* [Contribute with a new language](https://github.com/Lruihao/FixIt/pulls)
<!-- TODO update url -->
[Languages Compatibility](https://hugofixit.com/theme-documentation-basics/#language-compatibility)

## [Roadmap](https://github.com/Lruihao/FixIt/projects/1)

## [Changelog](https://github.com/Lruihao/FixIt/blob/main/CHANGELOG.md)

## Questions, ideas, bugs, pull requests

All feedback is welcome! Head over to the [issue tracker](https://github.com/Lruihao/FixIt/issues).

## License

FixIt is licensed under the **MIT** license. Check the [LICENSE file](https://github.com/Lruihao/FixIt/blob/master/LICENSE) for details.

Thanks to the authors of following resources included in the theme:

* [normalize.css](https://github.com/necolas/normalize.css)
* [Font Awesome](https://fontawesome.com/)
* [Simple Icons](https://github.com/simple-icons/simple-icons)
* [Animate.css](https://daneden.github.io/animate.css/)
* [autocomplete.js](https://github.com/algolia/autocomplete.js)
* [Lunr.js](https://lunrjs.com/)
* [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript)
* [lazysizes](https://github.com/aFarkas/lazysizes)
* [object-fit-images](https://github.com/fregante/object-fit-images)
* [Twemoji](https://github.com/twitter/twemoji)
* [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js)
* [clipboard.js](https://github.com/zenorocha/clipboard.js)
* [Sharer.js](https://github.com/ellisonleao/sharer.js)
* [TypeIt](https://typeitjs.com/)
* [KaTeX](https://katex.org/)
* [mermaid](https://github.com/knsv/mermaid)
* [ECharts](https://echarts.apache.org/)
* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* [APlayer](https://github.com/MoePlayer/APlayer)
* [MetingJS](https://github.com/metowolf/MetingJS)
* [Gitalk](https://github.com/gitalk/gitalk)
* [Valine](https://valine.js.org/)
* [cookieconsent](https://github.com/osano/cookieconsent)
* [Watermark](https://github.com/Lruihao/watermark)
* [pangu.js](https://github.com/vinta/pangu.js)

## Author

[Lruihao](https://lruihao.cn)
