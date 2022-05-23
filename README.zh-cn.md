# FixIt 主题 | Hugo

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/Lruihao/FixIt?style=flat-square)](https://github.com/Lruihao/FixIt/releases)
[![GitHub commits since tagged version](https://img.shields.io/github/commits-since/Lruihao/FixIt/v0.2.10?style=flat-square)](https://github.com/Lruihao/FixIt/compare/v0.2.10...master)
[![Hugo](https://img.shields.io/badge/Hugo-%5E0.62.0-ff4088?style=flat-square&logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/github/license/Lruihao/FixIt?style=flat-square)](https://github.com/Lruihao/FixIt/blob/master/LICENSE)

[English README](https://github.com/Lruihao/FixIt/blob/master/README.md) | 简体中文说明

> [FixIt](https://github.com/Lruihao/FixIt) 是一个**简洁**、**优雅**且**高效**的 [Hugo](https://gohugo.io/) 博客主题。

它的原型基于 [LoveIt 主题](https://github.com/dillonzq/LoveIt), [LeaveIt 主题](https://github.com/liuzc/LeaveIt) 和 [KeepIt 主题](https://github.com/Fastbyte01/KeepIt)。

<!-- [LoveIt 主题](https://github.com/dillonzq/LoveIt) 对我们来说是一个很棒的 Hugo 主题，很抱歉的是它的存储库已经停止维护很长一段时间了，所以我重建了一个名为 FixIt 的新主题，这样我可以更好地 **Fix It** 并使它用户体验更好。 -->

FixIt 主题继承了这些主题的优秀功能，并在此基础上添加了新的功能与优化，请阅读 [为什么选择 FixIt](#为什么选择-FixIt) 来了解更多。

![Hugo Theme FixIt](https://github.com/Lruihao/FixIt/raw/master/images/Apple-Devices-Preview.png)

## [立即开始](https://fixit.lruihao.cn/zh-cn/categories/documentation/)

前往这篇 [文档](https://fixit.lruihao.cn/zh-cn/theme-documentation-basics/)，阅读关于安装与使用的详细指南。

或者，在本地构建 [文档](https://fixit.lruihao.cn/zh-cn/)：

```bash
hugo server --source=exampleSite
```

当然，你也可以直接阅读 [FixIt 主题维基](https://github.com/Lruihao/FixIt/wiki)

## 迁移和升级

如果你现在正在使用 LoveIt 主题（或者一些其他的主题），你可以很容易地迁移至 FixIt。

你可以将这个主题仓库添加为你的网站目录的子模块。

```bash
git submodule add https://github.com/Lruihao/FixIt.git themes/FixIt
```

之后，你可以在站点目录通过这条命令来将主题更新至最新版本：

```bash
git submodule update --remote --merge
```

或者在主题目录中使用 shell 命令 `fixit_checker.sh` 将主题更新至最新版本：

```bash
sh fixit_checker.sh
```

接着，前往 `config.toml` 并将默认主题更改为 `FixIt`。

```diff
- theme = "LoveIt"
+ theme = "FixIt"
```

这样就完成了迁移工作，现在一切准备就绪 🎉

## 为什么选择 FixIt

* 自定义**标题栏（支持子菜单）**
* 自定义 **CSS 样式**
* 焕然一新的**主页**，已经兼容最新版 Hugo
* 大量的**样式细节调整**，包括颜色、字体大小、边距、代码预览样式
* 可读性更强的**深色模式**
* 一些美观的 **CSS 动画**
* 易用和自动展开的**文章目录**
* 支持更多的**社交链接**、**网站分享**和**评论系统**
* 支持基于 [Lunr.js](https://lunrjs.com/) 或 [algolia](https://www.algolia.com/) 的**搜索**
* 一键**复制代码**到剪贴板
* 支持基于 **[Font Awesome](https://fontawesome.com/) 图标**的扩展 Markdown 语法
* 支持**上标注释**的扩展 Markdown 语法
* 支持**分数**的扩展 Markdown 语法
* 支持基于 [KaTeX](https://katex.org/) 的**数学公式**
* 支持基于 [mermaid](https://github.com/knsv/mermaid) 的**图表**生成功能
* 支持基于 [ECharts](https://echarts.apache.org/) 的**交互式数据可视化**生成功能
* 支持基于 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) 的 **Mapbox** 地图显示功能
* 支持基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 的内嵌**音乐播放器**
* 支持内嵌 **Bilibili** 视频
* 支持多种**注释**的 shortcode
* 支持自定义样式的 shortcode
* 支持所有第三方库的 **CDN**
* 支持**渐进式网页应用**
* 支持基于 [cell-watermark](https://github.com/Lruihao/watermark) 的**网页水印**
* 支持基于 [pangu.js](https://github.com/vinta/pangu.js) 的**中文排版**
* 支持**卡片式链接**的 shortcode
* 支持**友情链接**的页面模板
* ...

所以，  
如果你更偏好 FixIt 主题的设计语言和自由度，  
如果你想便捷地使用扩展的 Font Awesome 图标，  
如果你想在文章内嵌数学公式、流程图、音乐或是 Bilibili 视频，  
那么，FixIt 主题可能是更适合你。  

## 谁在用 FixIt
为了直观地浏览主题特性，这里有一些基于 **FixIt** 主题渲染的预览网站。

* [FixIt 主题官网](https://fixit.lruihao.cn/zh-cn/)
* [FixIt 主题官网 - 预览](https://pre.fixit.lruihao.cn/zh-cn/)
* [李瑞豪的博客](https://lruihao.cn)
* [hiifong 的博客](https://52at.ml)
* 你可以通过 [提交 PR](https://github.com/Lruihao/FixIt/pulls) 添加你的网站（例如：[#111](https://github.com/Lruihao/FixIt/pull/111)）

## 特性

### 性能和 SEO

* **性能**优化：在 [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights) 中， 99/100 的移动设备得分和 100/100 的桌面设备得分
* 使用基于 JSON-LD 格式 的 **SEO SCHEMA** 文件进行 SEO 优化
* 支持 **[Google Analytics](https://analytics.google.com/analytics)**
* 支持 **[Fathom Analytics](https://usefathom.com/)**
* 支持搜索引擎的**网站验证** (Google, Bind, Yandex and Baidu)
* 支持所有第三方库的 **CDN**
* 基于 [lazysizes](https://github.com/aFarkas/lazysizes) 自动转换图片为**懒加载**

### 外观和布局

* **响应式**布局
* **浅色/深色** 主题模式
* 全局一致的**设计语言**
* 支持**分页**
* 易用和自动展开的**文章目录**
* 支持**多语言**和国际化
* 美观的 **CSS 动画**

### 社交和评论系统

* 支持 **[Gravatar](https://gravatar.com)** 头像
* 支持本地**头像**
* 支持多达 **73** 种社交链接
* 支持多达 **28** 种网站分享
* 支持 **[Disqus](https://disqus.com)** 评论系统
* 支持 **[Gitalk](https://github.com/gitalk/gitalk)** 评论系统
* 支持 **[Valine](https://valine.js.org/)** 评论系统
* 支持 **[Waline](https://waline.js.org/)** 评论系统
* 支持 **[Facebook](https://developers.facebook.com/docs/plugins/comments/) 评论**系统
* 支持 **[Telegram comments](https://comments.app/) 评论**系统
* 支持 **[Commento](https://commento.io/)** 评论系统
* 支持 **[Utterances](https://utteranc.es/)** 评论系统
* 支持 **[Artalk](https://artalk.js.org/)** 评论系统
* 支持 **[Twikoo](https://twikoo.js.org/)** 评论系统

### 扩展功能

* 支持基于 [Lunr.js](https://lunrjs.com/) 或 [algolia](https://www.algolia.com/) 的**搜索**
* 支持 **Twemoji**
* 支持**代码高亮**
* 一键**复制代码**到剪贴板
* 支持基于 [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js) 的**图片画廊**
* 支持 **[Font Awesome](https://fontawesome.com/) 图标**的扩展 Markdown 语法
* 支持**上标注释**的扩展 Markdown 语法
* 支持**分数**的扩展 Markdown 语法
* 支持基于 [KaTeX](https://katex.org/) 的**数学公式**
* 支持基于 [mermaid](https://github.com/knsv/mermaid) 的**图表** shortcode
* 支持基于 [ECharts](https://echarts.apache.org/) 的**交互式数据可视化** shortcode
* 支持基于 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) 的 **Mapbox** shortcode
* 支持基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 的**音乐播放器** shortcode
* 支持 **Bilibili 视频** shortcode
* 支持多种**注释**的 shortcode
* 支持**自定义样式**的 shortcode
* 支持**自定义脚本**的 shortcode
* 支持基于 [TypeIt](https://typeitjs.com/) 的**打字动画** shortcode
* 支持基于 [cookieconsent](https://github.com/osano/cookieconsent) 的 **Cookie 许可横幅**
* 支持**渐进式网页应用**
* 支持基于 [cell-watermark](https://github.com/Lruihao/watermark) 的**网页水印**
* 支持基于 [pangu.js](https://github.com/vinta/pangu.js) 的**中文排版**
* 支持**卡片式链接**的 shortcode
* 支持**友情链接**的页面模板
* ...

## 多语言和国际化

FixIt 支持下列语言：

* 英语
* 简体中文
* 繁体中文
* 法语
* 波兰语
* 巴西葡萄牙语
* 意大利语
* 西班牙语
* 德语
* 塞尔维亚语
* 俄语
* 罗马尼亚语
* 越南语
* [贡献一种新的语言](https://github.com/Lruihao/FixIt/pulls)

[语言兼容性](https://fixit.lruihao.cn/zh-cn/theme-documentation-basics/#language-compatibility)

## [路线图](https://github.com/Lruihao/FixIt/projects/1)

## [更新日志](https://github.com/Lruihao/FixIt/blob/master/CHANGELOG.md)

## 问题、想法、bugs 和 PRs

所有的反馈都是欢迎的！详见 [议题](https://github.com/Lruihao/FixIt/issues) 或者 [讨论](https://github.com/Lruihao/FixIt/discussions)。

## 参与贡献

请参阅 [CONTRIBUTING.md](/CONTRIBUTING.md) 以了解贡献该项目的基本信息。

确保在贡献和参与讨论时遵守 [CODE_OF_CONDUCT.md](/CODE_OF_CONDUCT.md)。

**贡献时，请先通过此存储库上的问题讨论您希望进行的更改，然后再进行实际更改**。

## [所有贡献者](/contributors.md)

## 许可协议

FixIt 根据 **MIT** 许可协议授权。 更多信息请查看 [LICENSE 文件](https://github.com/Lruihao/FixIt/blob/master/LICENSE)。

FixIt 主题中用到了以下项目，感谢它们的作者：

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
* [cell-watermark](https://github.com/Lruihao/watermark)
* [pangu.js](https://github.com/vinta/pangu.js)
* [Artalk](https://artalk.js.org/)
* [Waline](https://waline.js.org/)
* [Twikoo](https://twikoo.js.org/)
* [github-corners](https://github.com/tholman/github-corners)
* [giscus](https://giscus.app/zh-CN)
* [crypto-js](https://github.com/brix/crypto-js)

## 作者

[Lruihao](https://lruihao.cn)
