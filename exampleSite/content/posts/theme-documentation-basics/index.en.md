---
weight: 1
title: "Theme Documentation - Basics"
date: 2021-12-19T16:15:22+08:00
draft: false
author: "Lruihao"
authorLink: "https://lruihao.cn"
description: "Discover what the Hugo - FixIt theme is all about and the core-concepts behind it."
resources:
- name: "featured-image"
  src: "featured-image.jpg"

tags: ["installation", "configuration"]
categories: ["documentation"]

lightgallery: true

toc:
  auto: false

menu:
  main:
    name: "Basics"
    title: "Discover what the Hugo - FixIt theme is all about and the core-concepts behind it."
    parent: "documentation"
    pre: "<i class='fa-brands fa-readme fa-fw fa-sm'></i>"
---

Discover what the Hugo - **FixIt** theme is all about and the core-concepts behind it.

<!--more-->

## 1 Requirements

Thanks to the simplicity of Hugo, [Hugo](https://gohugo.io/) is the only dependency of this theme.

Just install latest version of [:(fa-regular fa-file-archive fa-fw): Hugo (> 0.62.0)](https://gohugo.io/getting-started/installing/) for your OS (**Windows**, **Linux**, **macOS**).

{{< admonition note "Why not support earlier versions of Hugo?" >}}
Since [Markdown Render Hooks](https://gohugo.io/getting-started/configuration-markup#markdown-render-hooks) was introduced in the [Hugo Christmas Edition](https://gohugo.io/news/0.62.0-relnotes/), this theme only supports Hugo versions above **0.62.0**.
{{< /admonition >}}

{{< admonition tip "Hugo extended version is recommended" >}}
Since some features of this theme need to processes :(fa-brands fa-sass fa-fw): SCSS to :(fa-brands fa-css3 fa-fw): CSS, it is recommended to use Hugo **extended** version for better experience.
{{< /admonition >}}

## 2 Installation

The following steps are here to help you initialize your new website. If you don’t know Hugo at all, we strongly suggest you learn more about it by following this [great documentation for beginners](https://gohugo.io/getting-started/quick-start/).

### 2.1 Create Your Project

Hugo provides a `new` command to create a new website:

```bash
hugo new site my_website
cd my_website
```

### 2.2 Install the Theme

The **FixIt** theme’s repository is: <https://github.com/Lruihao/FixIt>.

You can download the [latest release :(fa-regular fa-file-archive fa-fw): .zip file](https://github.com/Lruihao/FixIt/releases) of the theme and extract it in the `themes` directory.

Alternatively, clone this repository to the `themes` directory:

```bash
git clone https://github.com/Lruihao/FixIt.git themes/FixIt
```

Or, create an empty git repository and make this repository a submodule of your site directory:

```bash
git init
git submodule add https://github.com/Lruihao/FixIt.git themes/FixIt
```

### 2.3 Basic Configuration {#basic-configuration}

The following is a basic configuration for the FixIt theme:

```toml
baseURL = "http://example.org/"
# [en, zh-cn, fr, ...] determines default content language
defaultContentLanguage = "en"
# language code
languageCode = "en"
title = "My New Hugo Site"

# Change the default theme to be use when building the site with Hugo
theme = "FixIt"

[params]
  # FixIt theme version
  version = "0.2.X"

[menu]
  [[menu.main]]
    identifier = "posts"
    # you can add extra information before the name (HTML format is supported), such as icons
    pre = ""
    # you can add extra information after the name (HTML format is supported), such as icons
    post = ""
    name = "Posts"
    url = "/posts/"
    # title will be shown when you hover on this menu link
    title = ""
    weight = 1
  [[menu.main]]
    identifier = "tags"
    pre = ""
    post = ""
    name = "Tags"
    url = "/tags/"
    title = ""
    weight = 2
  [[menu.main]]
    identifier = "categories"
    pre = ""
    post = ""
    name = "Categories"
    url = "/categories/"
    title = ""
    weight = 3

# Markup related configuration in Hugo
[markup]
  # Syntax Highlighting (https://gohugo.io/content-management/syntax-highlighting)
  [markup.highlight]
    # false is a necessary configuration (https://github.com/Lruihao/FixIt/issues/43)
    noClasses = false
```

{{< admonition >}}
- When building the website, you can set a theme by using `--theme` option. However, we suggest you modify the configuration file (**config.toml**) and set the theme as the default.
- {{< version 0.2.14 >}} The FixIt theme provides sub menu support. Please refer to [Menu Advanced Configuration](#menu-advanced-configuration) for details.
{{< /admonition >}}

### 2.4 Create Your First Post

Here is the way to create your first post:

```bash
hugo new posts/first_post.md
```

Feel free to edit the post file by adding some sample content and replacing the title value in the beginning of the file.

{{< admonition >}}
By default all posts and pages are created as a draft. If you want to render these pages, remove the property `draft: true` from the metadata, set the property `draft: false` or add `-D`/`--buildDrafts` parameter to `hugo` command.
{{< /admonition >}}

### 2.5 Launching the Website Locally

Launch by using the following command:

```bash
# `hugo serve` is an alias of `hugo server`, which is not a misspelling ~
hugo server
```

Go to `http://localhost:1313`.

![Basic configuration preview](basic-configuration-preview.png "Basic configuration preview")

{{< admonition tip >}}
When you run `hugo server`, when the contents of the files change, the page automatically refreshes with the changes.
{{< /admonition >}}

{{< admonition >}}
Since the theme use `.Scratch` in Hugo to implement some features,
it is highly recommended that you add `--disableFastRender` parameter to `hugo server` command for the live preview of the page you are editing.

```bash
hugo server --disableFastRender
```
{{< /admonition >}}

### 2.6 Build the Website

When your site is ready to deploy, run the following command:

```bash
hugo
```

A `public` folder will be generated, containing all static content and assets for your website. It can now be deployed on any web server.

{{< admonition tip >}}
The website can be automatically published and hosted with [Netlify](https://www.netlify.com/) (Read more about [Automated HUGO deployments with Netlify](https://www.netlify.com/blog/2015/07/30/hosting-hugo-on-netlifyinsanely-fast-deploys/)).
Alternatively, you can use [AWS Amplify](https://gohugo.io/hosting-and-deployment/hosting-on-aws-amplify/), [Github pages](https://gohugo.io/hosting-and-deployment/hosting-on-github/), [Render](https://gohugo.io/hosting-and-deployment/hosting-on-render/) and more...
{{< /admonition >}}

## 3 Configuration

### 3.1 Site Configuration {#site-configuration}

In addition to [Hugo global configuration](https://gohugo.io/overview/configuration/) and [menu configuration](#basic-configuration), **FixIt** lets you define the following parameters in your site configuration (here is a `config.toml`, whose values are default).

Please open the code block below to view the complete sample configuration :(fa-regular fa-hand-point-down fa-fw)::

```toml
[params]
  # {{< version 0.2.15 changed >}} FixIt theme version
  version = "0.2.X" # e.g. "0.2.X", "0.2.15", "v0.2.15"
  # site description
  description = "This is My New Hugo Site"
  # site keywords
  keywords = ["Theme", "Hugo"]
  # site default theme ("light", "dark", "auto")
  defaultTheme = "auto"
  # public git repo url only then enableGitInfo is true
  gitRepo = ""
  # {{< version 0.1.1 >}} which hash function used for SRI, when empty, no SRI is used
  # ("sha256", "sha384", "sha512", "md5")
  fingerprint = ""
  # {{< version 0.2.0 >}} date format
  dateFormat = "2006-01-02"
  # website images for Open Graph and Twitter Cards
  images = ["/logo.png"]
  # {{< version 0.2.12 >}} enable PWA
  enablePWA = true
  # {{< version 0.2.14 >}} whether to add external Icon for external links automatically
  externalIcon = false
  # {{< version 0.2.14 >}} FixIt will, by default, inject a theme meta tag in the HTML head on the home page only.
  # You can turn it off, but we would really appreciate if you don’t, as this is a good way to watch FixIt's popularity on the rise.
  disableThemeInject = false

  # {{< version 0.2.0 >}} App icon config
  [params.app]
    # optional site title override for the app when added to an iOS home screen or Android launcher
    title = "FixIt"
    # whether to omit favicon resource links
    noFavicon = false
    # modern SVG favicon to use in place of older style .png and .ico files
    svgFavicon = ""
    # Safari mask icon color
    iconColor = "#5bbad5"
    # Windows v8-10 tile color
    tileColor = "#da532c"
    # {{< version 0.2.12 changed >}} Android browser theme color
    [params.app.themeColor]
      light = "#ffffff"
      dark = "#252627"

  # {{< version 0.2.0 >}} Search config
  [params.search]
    enable = true
    # type of search engine ("lunr", "algolia")
    type = "lunr"
    # max index length of the chunked content
    contentLength = 4000
    # placeholder of the search bar
    placeholder = ""
    # {{< version 0.2.1 >}} max number of results length
    maxResultLength = 10
    # {{< version 0.2.3 >}} snippet length of the result
    snippetLength = 30
    # {{< version 0.2.1 >}} HTML tag name of the highlight part in results
    highlightTag = "em"
    # {{< version 0.2.4 >}} whether to use the absolute URL based on the baseURL in search index
    absoluteURL = false
    [params.search.algolia]
      index = ""
      appID = ""
      searchKey = ""

  # Header config
  [params.header]
    # {{< version 0.2.13 changed >}} desktop header mode ("sticky", "normal", "auto")
    desktopMode = "sticky"
    # {{< version 0.2.13 changed >}} mobile header mode ("sticky", "normal", "auto")
    mobileMode = "auto"
    # {{< version 0.2.0 >}} Header title config
    [params.header.title]
      # URL of the LOGO
      logo = ""
      # title name
      name = ""
      # you can add extra information before the name (HTML format is supported), such as icons
      pre = ""
      # you can add extra information after the name (HTML format is supported), such as icons
      post = ""
      # {{< version 0.2.5 >}} whether to use typeit animation for title name
      typeit = false
    # {{< version 0.2.12 >}} Header subtitle config
    [params.header.subtitle]
      # subtitle name
      name = ""
      # whether to use typeit animation for subtitle name
      typeit = false

  # Footer config
  [params.footer]
    enable = true
    # {{< version 0.2.0 >}} Custom content (HTML format is supported)
    custom = ''
    # {{< version 0.2.0 >}} whether to show Hugo and theme info
    hugo = true
    # {{< version 0.2.0 >}} whether to show copyright info
    copyright = true
    # {{< version 0.2.0 >}} whether to show the author
    author = true
    # Site creation year
    since = 2019
    # {{< version 0.2.14 >}} Site creation time
    siteTime = '' # e.g. '2019-02-03T19:30:34+08:00'
    # {{< version 0.2.14 >}} whether to show total word count of site content
    wordCount = true
    # {{< version 0.2.12 >}} Public network security only in China (HTML format is supported)
    gov = ""
    # ICP info only in China (HTML format is supported)
    icp = ""
    # license info (HTML format is supported)
    license = '<a rel="license external nofollow noopener noreferrer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'

  # {{< version 0.2.0 >}} Section (all posts) page config
  [params.section]
    # special amount of posts in each section page
    paginate = 20
    # date format (month and day)
    dateFormat = "01-02"
    # amount of RSS pages
    rss = 10
    # {{< version 0.2.13 >}} recently updated posts settings
    [params.section.recentlyUpdated]
      enable = false
      rss = false
      days = 30
      maxCount = 10

  # {{< version 0.2.0 >}} List (category or tag) page config
  [params.list]
    # special amount of posts in each list page
    paginate = 20
    # date format (month and day)
    dateFormat = "01-02"
    # amount of RSS pages
    rss = 10

  # Home page config
  [params.home]
    # {{< version 0.2.0 >}} amount of RSS pages
    rss = 10
    # Home page profile
    [params.home.profile]
      enable = true
      # {{< version 0.2.13 >}} Gravatar mirror site domain, default: "www.gravatar.com"
      # {{< version 0.2.14 changed >}} {{< version 0.2.15 deleted >}} The parameter `home.profile.gravatarSite` is deprecated since v0.2.14, use `gravatar.host` instead
      # gravatarSite = ""
      # Gravatar Email for preferred avatar in home page
      gravatarEmail = ""
      # URL of avatar shown in home page
      avatarURL = "/images/avatar.png"
      # {{< version 0.2.7 changed >}} title shown in home page (HTML format is supported)
      title = ""
      # subtitle shown in home page
      subtitle = "This is My New Hugo Site"
      # whether to use typeit animation for subtitle
      typeit = true
      # whether to show social links
      social = true
      # {{< version 0.2.0 >}} disclaimer (HTML format is supported)
      disclaimer = ""
    # Home page posts
    [params.home.posts]
      enable = true
      # special amount of posts in each home posts page
      paginate = 6

  # Social config about the author
  [params.social]
    GitHub = "xxxx"
    Linkedin = ""
    Twitter = "xxxx"
    Instagram = "xxxx"
    Facebook = "xxxx"
    Telegram = "xxxx"
    Medium = ""
    Gitlab = ""
    Youtubelegacy = ""
    Youtubecustom = ""
    Youtubechannel = ""
    Tumblr = ""
    Quora = ""
    Keybase = ""
    Pinterest = ""
    Reddit = ""
    Codepen = ""
    FreeCodeCamp = ""
    Bitbucket = ""
    Stackoverflow = ""
    Weibo = ""
    Odnoklassniki = ""
    VK = ""
    Flickr = ""
    Xing = ""
    Snapchat = ""
    Soundcloud = ""
    Spotify = ""
    Bandcamp = ""
    Paypal = ""
    Fivehundredpx = ""
    Mix = ""
    Goodreads = ""
    Lastfm = ""
    Foursquare = ""
    Hackernews = ""
    Kickstarter = ""
    Patreon = ""
    Steam = ""
    Twitch = ""
    Strava = ""
    Skype = ""
    Whatsapp = ""
    Zhihu = ""
    Douban = ""
    Angellist = ""
    Slidershare = ""
    Jsfiddle = ""
    Deviantart = ""
    Behance = ""
    Dribbble = ""
    Wordpress = ""
    Vine = ""
    Googlescholar = ""
    Researchgate = ""
    Mastodon = ""
    Thingiverse = ""
    Devto = ""
    Gitea = ""
    XMPP = ""
    Matrix = ""
    Bilibili = ""
    # ORCID, ... , CSDN {{< version 0.2.13 >}}
    ORCID = ""
    Liberapay = ""
    Ko-Fi = ""
    BuyMeaCoffee = ""
    Linktree = ""
    QQ = ""
    QQGroup = "" # https://qun.qq.com/join.html
    Diaspora = ""
    CSDN = ""
    Email = "xxxx@xxxx.com"
    RSS = true # {{< version 0.2.0 >}}

  # {{< version 0.2.0 changed >}} Page config
  [params.page]
    # {{< version 0.2.0 >}} whether to hide a page from home page
    hiddenFromHomePage = false
    # {{< version 0.2.0 >}} whether to hide a page from search results
    hiddenFromSearch = false
    # {{< version 0.2.0 >}} whether to enable twemoji
    twemoji = false
    # whether to enable lightgallery
    lightgallery = false
    # {{< version 0.2.0 >}} whether to enable the ruby extended syntax
    ruby = true
    # {{< version 0.2.0 >}} whether to enable the fraction extended syntax
    fraction = true
    # {{< version 0.2.0 >}} whether to enable the fontawesome extended syntax
    fontawesome = true
    # license info (HTML format is supported)
    license = '<a rel="license external nofollow noopener noreferrer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'
    # whether to show link to Raw Markdown content of the content
    linkToMarkdown = true
    # {{< version 0.2.4 >}} whether to show the full text content in RSS
    rssFullText = false
    # {{< version 0.2.13 >}} Page style ("narrow", "normal", "wide", ...)
    pageStyle = "normal"
    # {{< version 0.2.14 >}} Gravatar is force-used as the author's avatar
    gravatarForce = false
    # {{< version 0.2.15 >}} Repost config
    [params.page.repost]
      enable = false
      url = ""
    # {{< version 0.2.0 >}} Table of the contents config
    [params.page.toc]
      # whether to enable the table of the contents
      enable = true
      # {{< version 0.2.9 >}} whether to keep the static table of the contents in front of the post
      keepStatic = false
      # whether to make the table of the contents in the sidebar automatically collapsed
      auto = true
      # {{< version 0.2.13 >}} position of TOC ("left", "right")
      position = "right"
    # {{< version 0.2.13 >}} Display a message at the beginning of an article to warn the reader that its content might be expired
    [params.page.expirationReminder]
      enable = false
      # Display the reminder if the last modified time is more than 90 days ago
      reminder = 90
      # Display warning if the last modified time is more than 180 days ago
      warning = 180
      # If the article expires, close the comment or not
      closeComment = false
    # {{< version 0.2.0 changed >}} {{< link "https://katex.org/" KaTeX >}} mathematical formulas (https://katex.org)
    [params.page.math]
      enable = true
      # default block delimiter is $$ ... $$ and \\[ ... \\]
      blockLeftDelimiter = ""
      blockRightDelimiter = ""
      # default inline delimiter is $ ... $ and \\( ... \\)
      inlineLeftDelimiter = ""
      inlineRightDelimiter = ""
      # KaTeX extension copy_tex
      copyTex = true
      # KaTeX extension mhchem
      mhchem = true
    # {{< version 0.2.0 >}} Code config
    [params.page.code]
      # whether to show the copy button of the code block
      copy = true
      # {{< version 0.2.13 >}} whether to show the edit button of the code block
      edit = true
      # the maximum number of lines of displayed code by default
      maxShownLines = 10
    # {{< version 0.2.14 >}} Post edit
    [params.page.edit]
      enable = false
      # url = "https://github.com/user-name/repo-name/edit/branch-name/subdirectory-name" # Link for fork & edit
      url = "" # Link for fork & edit
    # {{< version 0.2.0 >}} {{< link "https://docs.mapbox.com/mapbox-gl-js" "Mapbox GL JS" >}} config (https://docs.mapbox.com/mapbox-gl-js)
    [params.page.mapbox]
      # access token of Mapbox GL JS
      accessToken = ""
      # style for the light theme
      lightStyle = "mapbox://styles/mapbox/light-v9"
      # style for the dark theme
      darkStyle = "mapbox://styles/mapbox/dark-v9"
      # whether to add {{< link "https://docs.mapbox.com/mapbox-gl-js/api#navigationcontrol" NavigationControl >}}
      navigation = true
      # whether to add {{< link "https://docs.mapbox.com/mapbox-gl-js/api#geolocatecontrol" GeolocateControl >}}
      geolocate = true
      # whether to add {{< link "https://docs.mapbox.com/mapbox-gl-js/api#scalecontrol" ScaleControl >}}
      scale = true
      # whether to add {{< link "https://docs.mapbox.com/mapbox-gl-js/api#fullscreencontrol" FullscreenControl >}}
      fullscreen = true
    # {{< version 0.2.0 changed >}} social share links in post page
    [params.page.share]
      enable = true
      Twitter = true
      Facebook = true
      Linkedin = false
      Whatsapp = true
      Pinterest = false
      Tumblr = false
      HackerNews = false
      Reddit = false
      VK = false
      Buffer = false
      Xing = false
      Line = true
      Instapaper = false
      Pocket = false
      Digg = false
      Stumbleupon = false
      Flipboard = false
      Weibo = true
      Renren = false
      Myspace = true
      Blogger = true
      Baidu = false
      Odnoklassniki = false
      Evernote = true
      Skype = false
      Trello = false
      Mix = false
    # {{< version 0.2.15 changed >}} Comment config
    [params.page.comment]
      enable = false
      # {{< version 0.2.13 >}} {{< link "https://artalk.js.org/" Artalk >}} comment config (https://artalk.js.org/)
      [params.page.comment.artalk]
        enable = false
        server = "https://yourdomain/api/"
        site = "默认站点"
        placeholder = ""
        noComment = ""
        sendBtn = ""
        editorTravel = true
        flatMode = 'auto'
        maxNesting = 3
        # It take effect when `params.page.lightgallery` is enabled
        lightgallery = false
        locale = "" # {{< version 0.2.15 >}}
      # {{< version 0.1.1 >}} {{< link "https://disqus.com/" Disqus >}} comment config (https://disqus.com)
      [params.page.comment.disqus]
        enable = false
        # Disqus shortname to use Disqus in posts
        shortname = ""
      # {{< version 0.1.1 >}} {{< link "https://github.com/gitalk/gitalk" Gitalk >}} comment config (https://github.com/gitalk/gitalk)
      [params.page.comment.gitalk]
        enable = false
        owner = ""
        repo = ""
        clientId = ""
        clientSecret = ""
      # {{< link "https://github.com/xCss/Valine" Valine >}} comment config (https://github.com/xCss/Valine)
      [params.page.comment.valine]
        enable = false
        appId = ""
        appKey = ""
        placeholder = ""
        avatar = "mp"
        meta= ""
        pageSize = 10
        lang = ""
        visitor = true
        recordIP = true
        highlight = true
        enableQQ = false
        serverURLs = ""
        # {{< version 0.2.6 >}} emoji data file name, default is "google.yml"
        # ("apple.yml", "google.yml", "facebook.yml", "twitter.yml")
        # located in "themes/FixIt/assets/data/emoji/" directory
        # you can store your own data files in the same path under your project:
        # "assets/data/emoji/"
        emoji = ""
        commentCount = true # {{< version 0.2.13 >}}
      # {{< version 0.2.13 >}} {{< link "https://waline.js.org" Waline >}} comment config (https://waline.js.org)
      [params.page.comment.waline]
        enable = false
        serverURL = ""
        pageview = false # {{< version 0.2.15 >}}
        emoji = ['//unpkg.com/@waline/emojis@1.0.1/weibo']
        meta = ['nick', 'mail', 'link']
        requiredMeta = []
        login = 'enable'
        wordLimit = 0
        pageSize = 10
        imageUploader = false # {{< version 0.2.15 >}}
        highlighter = true # {{< version 0.2.15 >}}
        comment = false # {{< version 0.2.15 >}}
        # visitor = false # {{< version 0.2.15 deleted >}} renamed to pageview
        # uploadImage = false # {{< version 0.2.15 deleted >}} renamed to imageUploader
        # highlight = true # {{< version 0.2.15 deleted >}} renamed to highlighter
        # mathTagSupport = false {{< version 0.2.15 deleted >}}
        # commentCount = false {{< version 0.2.15 deleted >}} renamed to comment
      # {{< link "https://developers.facebook.com/docs/plugins/comments" "Facebook comment" >}} config (https://developers.facebook.com/docs/plugins/comments)
      [params.page.comment.facebook]
        enable = false
        width = "100%"
        numPosts = 10
        appId = ""
        languageCode = ""
      # {{< version 0.2.0 >}} {{< link "https://comments.app/" "Telegram comments" >}} config (https://comments.app)
      [params.page.comment.telegram]
        enable = false
        siteID = ""
        limit = 5
        height = ""
        color = ""
        colorful = true
        dislikes = false
        outlined = false
      # {{< version 0.2.0 >}} {{< link "https://commento.io/" "Commento" >}} comment config (https://commento.io)
      [params.page.comment.commento]
        enable = false
      # {{< version 0.2.5 >}} {{< link "https://utteranc.es/" "Utterances" >}} comment config (https://utteranc.es)
      [params.page.comment.utterances]
        enable = false
        # owner/repo
        repo = ""
        issueTerm = "pathname"
        label = ""
        lightTheme = "github-light"
        darkTheme = "github-dark"
      # {{< version 0.2.13 >}} {{< link "https://twikoo.js.org/" "Twikoo" >}} comment config (https://twikoo.js.org/)
      [params.page.comment.twikoo]
        enable = false
        envId = ""
        region = ""
        path = ""
        visitor = true
        commentCount = true
        # It take effect when `params.page.lightgallery` is enabled
        lightgallery = false
      # {{< version 0.2.14 >}} {{< link "https://giscus.app/" "Giscus" >}} comments config
      [params.page.comment.giscus]
        enable = false
        repo = ""
        repoId = ""
        category = ""
        categoryId = ""
        mapping = ""
        reactionsEnabled = "1"
        emitMetadata = "0"
        inputPosition = "bottom" # top, bottom
        lightTheme = "light"
        darkTheme = "dark"
        lazyLoad = true
    # {{< version 0.2.7 >}} Third-party library config
    [params.page.library]
      [params.page.library.css]
        # someCSS = "some.css"
        # located in "assets/"
        # Or
        # someCSS = "https://cdn.example.com/some.css"
      [params.page.library.js]
        # someJavascript = "some.js"
        # located in "assets/"
        # Or
        # someJavascript = "https://cdn.example.com/some.js"
    # {{< version 0.2.10 changed >}} Page SEO config
    [params.page.seo]
      # image URL
      images = []
      # Publisher info
      [params.page.seo.publisher]
        name = ""
        logoUrl = ""

  # {{< version 0.2.5 >}} TypeIt config
  [params.typeit]
    # typing speed between each step (measured in milliseconds)
    speed = 100
    # blinking speed of the cursor (measured in milliseconds)
    cursorSpeed = 1000
    # character used for the cursor (HTML format is supported)
    cursorChar = "|"
    # cursor duration after typing finishing (measured in milliseconds, "-1" means unlimited)
    duration = -1
  
  # {{< version 0.2.15 >}} Mermaid config
  [params.mermaid]
    # For values, see https://mermaid-js.github.io/mermaid/#/Setup?id=theme
    themes = ['neutral', 'dark']

  # {{< version 0.2.12 >}} PanguJS config
  [params.pangu]
    # For Chinese writing
    enable = false

  # {{< version 0.2.12 >}} Watermark config
  # Detail config see https://github.com/Lruihao/watermark#readme
  [params.watermark]
    enable = false
    # watermark's text (HTML format is supported)
    content = ''
    # watermark's transparency
    opacity = 0.1
    # parent of watermark's container
    appendTo = '.wrapper>main'
    # watermark's width. unit: px
    width = 150
    # watermark's height. unit: px
    height = 20
    # row spacing of watermarks. unit: px
    rowSpacing = 60
    # col spacing of watermarks. unit: px
    colSpacing = 30
    # watermark's tangent angle. unit: deg
    rotate = 15
    # watermark's fontSize. unit: rem
    fontSize = 0.85
    # {{< version 0.2.13 >}} watermark's fontFamily
    fontFamily = 'inherit'

  # {{< version 0.2.12 >}} Busuanzi count
  [params.ibruce]
    enable = true
    # Enable in post meta
    enablePost = false
    # {{< version 0.2.14 changed >}} {{< version 0.2.15 deleted >}} Site creation time
    # The parameter `ibruce.siteTime` is deprecated since v0.2.14, use `footer.siteTime` instead
    # siteTime = '' # e.g. '2019-02-03T19:30:34+08:00'

  # Site verification code config for Google/Bing/Yandex/Pinterest/Baidu/360/Sogou
  [params.verification]
    google = ""
    bing = ""
    yandex = ""
    pinterest = ""
    baidu = ""
    so = ""
    sogou = ""

  # {{< version 0.2.10 >}} Site SEO config
  [params.seo]
    # image URL
    image = ""
    # thumbnail URL
    thumbnailUrl = ""

  # {{< version 0.2.0 >}} Analytics config
  [params.analytics]
    enable = false
    # Google Analytics
    [params.analytics.google]
      id = ""
      # whether to anonymize IP
      anonymizeIP = true
    # Fathom Analytics
    [params.analytics.fathom]
      id = ""
      # server url for your tracker if you're self hosting
      server = ""

  # {{< version 0.2.7 >}} Cookie consent config
  [params.cookieconsent]
    enable = true
    # text strings used for Cookie consent banner
    [params.cookieconsent.content]
      message = ""
      dismiss = ""
      link = ""

  # {{< version 0.2.7 changed >}} CDN config for third-party library files
  [params.cdn]
    # CDN data file name, disabled by default
    # ("jsdelivr.yml", "unpkg.yml")
    # located in "themes/FixIt/assets/data/cdn/" directory
    # you can store your own data files in the same path under your project:
    # "assets/data/cdn/"
    # data = "unpkg"

  # {{< version 0.2.8 >}} Compatibility config
  [params.compatibility]
    # whether to use Polyfill.io to be compatible with older browsers
    polyfill = false
    # whether to use object-fit-images to be compatible with older browsers
    objectFit = false
  
  # {{< version 0.2.12 >}} Custom JS at last
  # "_custom.js" located in "themes/FixIt/assets/js/"
  # you can store your custom JS file in the same path under your project:
  # "assets/js/_custom.js"
  [params.customJS]
    enable = true
  # {{< version 0.2.14 >}} GitHub banner in the top-right or top-left corner
  [params.githubCorner]
    enable = false
    permalink = "https://github.com/Lruihao/FixIt"
    title = "View source on GitHub"
    position = "right" # left, right
  # {{< version 0.2.14 >}} Gravatar config
  [params.gravatar]
    # Gravatar host, default: "www.gravatar.com"
    host = "www.gravatar.com" # "cn.gravatar.com", "gravatar.loli.net"
    style = "" # "", mp, identicon, monsterid, wavatar, retro, blank, robohash
  # {{< version 0.2.15 >}} Developer options
  [params.developerOptions]
    enable = false
    # Check for updates
    c4u = false
    # Please do not expose to public!
    githubToken = ""

# Markup related configuration in Hugo
[markup]
  # {{< link "https://gohugo.io/content-management/syntax-highlighting" "Syntax Highlighting" >}} (https://gohugo.io/content-management/syntax-highlighting)
  [markup.highlight]
    ########## necessary configurations ##########
    # {{< link "https://github.com/Lruihao/FixIt/issues/43" >}}
    codeFences = true
    lineNos = true
    lineNumbersInTable = true
    noClasses = false 
    ########## necessary configurations ##########
    guessSyntax = true
  # Goldmark is from Hugo 0.60 the default library used for Markdown
  [markup.goldmark]
    [markup.goldmark.extensions]
      definitionList = true
      footnote = true
      linkify = true
      strikethrough = true
      table = true
      taskList = true
      typographer = true
    [markup.goldmark.renderer]
      # whether to use HTML tags directly in the document
      unsafe = true
  # Table Of Contents settings
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 6

# Author config
[author]
  name = "xxxx"
  email = ""
  link = ""

# Sitemap config
[sitemap]
  changefreq = "weekly"
  filename = "sitemap.xml"
  priority = 0.5

# {{< link "https://gohugo.io/content-management/urls#permalinks" "Permalinks config" >}} (https://gohugo.io/content-management/urls#permalinks)
[Permalinks]
  # posts = ":year/:month/:filename"
  posts = ":filename"

# {{< link "https://gohugo.io/about/hugo-and-gdpr/" "Privacy config" >}} (https://gohugo.io/about/hugo-and-gdpr/)
[privacy]
  [privacy.twitter]
    enableDNT = true
  [privacy.youtube]
    privacyEnhanced = true

# {{< version 0.2.15 changed >}}
[mediaTypes]
  # Options to make output .md files
  [mediaTypes."text/markdown"]
    suffixes = ["md"]
  # Options to make output .txt files
  [mediaTypes."text/plain"]
    suffixes = ["txt"]

# {{< version 0.2.15 changed >}}
[outputFormats]
  # Options to make output .md files
  [outputFormats.MarkDown]
    mediaType = "text/markdown"
    isPlainText = true
    isHTML = false
  # {{< version 0.2.15 >}} Options to make output baidu_urls.txt file
  [outputFormats.BaiduUrls]
    baseName = "baidu_urls"
    mediaType = "text/plain"
    isPlainText = true
    isHTML = false

# {{< version 0.2.15 changed >}} Options to make hugo output files
[outputs]
  home = ["HTML", "RSS", "JSON", "BaiduUrls"]
  page = ["HTML", "MarkDown"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML", "RSS"]
  taxonomyTerm = ["HTML"]
```

{{< admonition >}}
Note that some of these parameters are explained in details in other sections of this documentation.
{{< /admonition >}}

{{< admonition note "Hugo environments" >}}
Default environments are `development` with `hugo server` and `production` with `hugo`.

Due to limitations in the local `development` environment,
the **comment system**, **CDN** and **fingerprint** will not be enabled in the `development` environment.

You could enable these features with `hugo server -e production`.
{{< /admonition >}}

{{< admonition tip "Tips about CDN Configuration" >}}
{{< version 0.2.7 changed >}}

```toml
[params.cdn]
  # CDN data file name, disabled by default
  # ("jsdelivr.yml")
  data = ""
````

The default CDN data file is located in `themes/FixIt/assets/data/cdn/` directory.
You can store your own data file in the same path under your project: `assets/data/cdn/`.
{{< /admonition >}}

{{< admonition tip "Tips about social Configuration" >}}
{{< version 0.2.0 >}}

You can directly set your ID to get a default social link and its icon:

```toml
[params.social]
  Mastodon = "@xxxx"
```

The social link generated is `https://mastodon.technology/@xxxx`.

Or You can set more options through a dict:

```toml
[params.social]
  [params.social.Mastodon]
    # weight when arranging icons (the greater the weight, the later the icon is positioned)
    weight = 0
    # your social ID
    id = "@xxxx"
    # prefix of your social link
    prefix = "https://mastodon.social/"
    # content hovering on the icon
    title = "Mastodon"
```

The default data of all supported social links is located in `themes/FixIt/assets/data/social.yaml`,
which is you can refer to.
{{< /admonition >}}

![Complete configuration preview](complete-configuration-preview.png "Complete configuration preview")

### 3.2 Favicons, Browserconfig, Manifest

It is recommended to put your own favicons:

* apple-touch-icon.png (180x180)
* favicon-32x32.png (32x32)
* favicon-16x16.png (16x16)
* mstile-150x150.png (150x150)
* android-chrome-192x192.png (192x192)
* android-chrome-512x512.png (512x512)

into `/static`. They’re easily created via [https://realfavicongenerator.net/](https://realfavicongenerator.net/).

Customize `browserconfig.xml` and `site.webmanifest` to set theme-color and background-color.

### 3.3 Style Customization

{{< version 0.2.8 changed >}}

{{< admonition >}}
Hugo **extended** version is necessary for the style customization.
{{< /admonition >}}

**FixIt** theme has been built to be as configurable as possible by defining custom `.scss` style files.

The directory including the custom `.scss` style files is `assets/css` relative to **your project root directory**.

In `assets/css/_override.scss`, you can override the variables in `themes/FixIt/assets/css/_variables.scss` to customize the style.

Here is a example:

```scss
@import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,700&display=swap&subset=latin-ext');
$code-font-family: Fira Mono, Source Code Pro, Menlo, Consolas, Monaco, monospace;
```

In `assets/css/_custom.scss`, you can add some css style code to customize the style.

#### 3.3.1 Page Style {#page-style}

{{< version 0.2.13 >}}

The FixIt theme provides a page width configuration option `pageStyle` and three values.

* **narrow** Keep `<v0.2.13` page/toc width ratio
* **normal** New default page/toc width ratio
* **wide** Larger page/toc width ratio

In addition, you can also customize the `pageStyle` value in `assets/css/_custom.scss`

For example: `pageStyle="custom"`

```scss
@media only screen and (min-width: 1441px) {
  [page-style='custom'] {
    .page {
      width: 70%;
    }

    aside {
      width: 15%;
    }
  }
}

@media only screen and (max-width: 1440px) {
  [page-style='custom'] {
    .page {
      width: 60%;
    }

    aside {
      width: 20%;
    }
  }
}

@media only screen and (max-width: 1200px) {
  [page-style='custom'] {
    .page {
      width: 56%;
    }

    aside {
      width: 22%;
    }
  }
}
```

#### 3.3.2 Print Style {#print-style}

{{< version 0.2.13 >}}

There are three css common class for print view in FixIt Theme.

* `page-break-before` Insert page break before element
* `page-break-after` Insert page break after element
* `print-d-none` Hide elements in print view

Here is a simple exmple:

```html
<div class="page-break-before"></div>
<div class="page-break-after"></div>
<div class="print-d-none">
  Something you want to hide in the print view is written here.
</div>
```

### 3.4 Menu Advanced Configuration {#menu-advanced-configuration}

Hugo has a simple yet powerful [menu system](https://gohugo.io/content-management/menus/).

According to the interface provided by Hugo, FixIt theme only realizes some functions, but I think it is enough to meet the needs of most people and make users easier to use.

The following is a complete menu item configuration:

```toml
[menu]
  [[menu.main]]
    identifier = "posts"
    # {{< version 0.2.14 >}} Identifier of the parent menu item
    parent = ""
    # you can add extra information before the name (HTML format is supported), such as icons
    pre = ""
    # you can add extra information after the name (HTML format is supported), such as icons
    post = ""
    name = "Posts"
    url = "/posts/"
    # title will be shown when you hover on this menu link
    title = ""
    weight = 1
    # {{< version 0.2.14 >}} add user-defined content to menu items
    [menu.main.params]
      # add css class to a specific menu item
      class = 'text-center'
      # whether set as a draft menu item whose function is similar to a draft post/page
      draft = false
```

#### 3.4.1 Sub Menu

{{< version 0.2.14 >}}

In consideration of practicability and typesetting, the FixIt theme only supports two-tier nested menus, which can be configured through the `parent` field in the menu configuration.

The parent item of a menu item should be the `identifier` of another menu item, and the identifier should be unique in the menu.

#### 3.4.2 Menu Params

{{< version 0.2.14 >}}

You can also add user-defined content to menu items via the `params` field. The FixIt theme currently provides two parameters:

* **class** *{String}* add css class to a specific menu item
* **draft** *{Boolean}* whether set as a draft menu item whose function is similar to a draft post/page

{{< admonition >}}
The draft menu items and posts/pages can be rendered by starting the `Hugo server` command or adding the `-D`/`--buildDrafts` parameter to `hugo` command.
{{< /admonition >}}

{{< admonition tip >}}
This helps to distinguish the different contents of preview environment and production environment during deployment.

For example:

-  [preview environment with draft menu items](https://pre.fixit.lruihao.cn)
-  [production environment without draft menu items](https://fixit.lruihao.cn)
{{< /admonition >}}

#### 3.4.3 Add content to Menu {#content-to-menu}

It’s also possible to create menu entries from the page by configuring `front matter` (i.e. the `.md`-file).

Here is a `yaml` example:

```yaml
---
title: "Theme Documentation - Basics"
author: "Lruihao"
menu:
  main:
    name: "Basics"
    title: "Discover what the Hugo - FixIt theme is all about and the core-concepts behind it."
    parent: "documentation"
    pre: "<i class='fa-brands fa-readme fa-fw fa-sm'></i>"
---
...
```

## 4 Multilingual and i18n

**FixIt** theme is fully compatible with Hugo multilingual mode, which provides in-browser language switching.

![Language Switch](language-switch.gif "Language Switch")

### 4.1 Compatibility {#language-compatibility}

{{< version 0.2.10 changed >}}

| Language             | Hugo Code | HTML `lang` Attribute | Theme Docs                    | Lunr.js Support               |
|:-------------------- |:---------:|:---------------------:|:-----------------------------:|:-----------------------------:|
| English              | `en`      | `en`                  | :(fa-regular fa-check-square fa-fw): | :(fa-regular fa-check-square fa-fw): |
| Simplified Chinese   | `zh-cn`   | `zh-CN`               | :(fa-regular fa-check-square fa-fw): | :(fa-regular fa-check-square fa-fw): |
| French               | `fr`      | `fr`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |
| Polish               | `pl`      | `pl`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-square fa-fw):       |
| Brazilian Portuguese | `pt-br`   | `pt-BR`               | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |
| Italian              | `it`      | `it`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |
| Spanish              | `es`      | `es`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |
| German               | `de`      | `de`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |
| Serbian              | `sr`      | `sr`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-square fa-fw):       |
| Russian              | `ru`      | `ru`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |
| Romanian             | `ro`      | `ro`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |
| Vietnamese           | `vi`      | `vi`                  | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |
| Traditional Chinese  | `zh-tw`   | `zh-TW`               | :(fa-regular fa-square fa-fw):       | :(fa-regular fa-check-square fa-fw): |

### 4.2 Basic Configuration

After learning [how Hugo handle multilingual websites](https://gohugo.io/content-management/multilingual), define your languages in your [site configuration](#site-configuration).

For example with English, Chinese and French website:

```toml
# [en, zh-cn, fr, pl, ...] determines default content language
defaultContentLanguage = "en"

[languages]
  [languages.en]
    weight = 1
    title = "My New Hugo Site"
    languageCode = "en"
    languageName = "English"
    [[languages.en.menu.main]]
      identifier = "posts"
      pre = ""
      post = ""
      name = "Posts"
      url = "/posts/"
      title = ""
      weight = 1
    [[languages.en.menu.main]]
      identifier = "tags"
      pre = ""
      post = ""
      name = "Tags"
      url = "/tags/"
      title = ""
      weight = 2
    [[languages.en.menu.main]]
      identifier = "categories"
      pre = ""
      post = ""
      name = "Categories"
      url = "/categories/"
      title = ""
      weight = 3

  [languages.zh-cn]
    weight = 2
    title = "我的全新 Hugo 网站"
    # language code, CN only here
    languageCode = "zh-CN"
    languageName = "简体中文"
    # whether to include Chinese/Japanese/Korean
    hasCJKLanguage = true
    [[languages.zh-cn.menu.main]]
      identifier = "posts"
      pre = ""
      post = ""
      name = "文章"
      url = "/posts/"
      title = ""
      weight = 1
    [[languages.zh-cn.menu.main]]
      identifier = "tags"
      pre = ""
      post = ""
      name = "标签"
      url = "/tags/"
      title = ""
      weight = 2
    [[languages.zh-cn.menu.main]]
      identifier = "categories"
      pre = ""
      post = ""
      name = "分类"
      url = "/categories/"
      title = ""
      weight = 3

  [languages.fr]
    weight = 3
    title = "Mon nouveau site Hugo"
    languageCode = "fr"
    languageName = "Français"
    [[languages.fr.menu.main]]
      identifier = "posts"
      pre = ""
      post = ""
      name = "Postes"
      url = "/posts/"
      title = ""
      weight = 1
    [[languages.fr.menu.main]]
      identifier = "tags"
      pre = ""
      post = ""
      name = "Balises"
      url = "/tags/"
      title = ""
      weight = 2
    [[languages.fr.menu.main]]
      identifier = "categories"
      name = "Catégories"
      pre = ""
      post = ""
      url = "/categories/"
      title = ""
      weight = 3
```

Then, for each new page, append the language code to the file name.

Single file `my-page.md` is split in three files:

* in English: `my-page.en.md`
* in Chinese: `my-page.zh-cn.md`
* in French: `my-page.fr.md`

{{< admonition >}}
Be aware that only translated pages are displayed in menu. It’s not replaced with default language content.
{{< /admonition >}}

{{< admonition tip >}}
Use [Front Matter parameter](https://gohugo.io/content-management/multilingual#translate-your-content) to translate urls too.
{{< /admonition >}}

### 4.3 Overwrite Translation Strings

Translations strings are used for common default values used in the theme. Translations are available in [some languages](#language-compatibility), but you may use another language or want to override default values.

To override these values, create a new file in your local i18n folder `i18n/<languageCode>.toml` and inspire yourself from `themes/FixIt/i18n/en.toml`.

By the way, as these translations could be used by other people, please take the time to propose a translation by [making a PR :(fa-solid fa-code-branch fa-fw):](https://github.com/Lruihao/FixIt/pulls) to the theme!

## 5 Search

{{< version 0.2.0 >}}

Based on [Lunr.js](https://lunrjs.com/) or [algolia](https://www.algolia.com/), searching is supported in **FixIt** theme.

### 5.1 Output Configuration

In order to generate `index.json` for searching, add `JSON` output file type to the `home` of the `outputs` part in your [site configuration](#site-configuration).

```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

### 5.2 Search Configuration

Based on `index.json` generated by Hugo, you could activate searching.

Here is the search configuration in your [site configuration](#site-configuration):

```toml
[params.search]
  enable = true
  # type of search engine ("lunr", "algolia")
  type = "lunr"
  # max index length of the chunked content
  contentLength = 4000
  # placeholder of the search bar
  placeholder = ""
  # {{< version 0.2.1 >}} max number of results length
  maxResultLength = 10
  # {{< version 0.2.3 >}} snippet length of the result
  snippetLength = 30
  # {{< version 0.2.1 >}} HTML tag name of the highlight part in results
  highlightTag = "em"
  # {{< version 0.2.4 >}} whether to use the absolute URL based on the baseURL in search index
  absoluteURL = false
  [params.search.algolia]
    index = ""
    appID = ""
    searchKey = ""
```

{{< admonition note "How to choose search engine?" >}}
The following is a comparison of two search engines:

* `lunr`: simple, no need to synchronize `index.json`, no limit for `contentLength`,
  but high bandwidth and low performance (Especially for Chinese which needs a large segmentit library)
* `algolia`: high performance and low bandwidth, but need to synchronize `index.json` and limit for `contentLength`

{{< version 0.2.3 >}} The content of the post is separated by `h2` and `h3` HTML tag to improve query performance and basically implement full-text search.
`contentLength` is used to limit the max index length of the part starting with `h2` and `h3` HTML tag.
{{< /admonition >}}

{{< admonition tip "Tips about algolia" >}}
You need to upload `index.json` files to algolia to activate searching.
You could upload the `index.json` files by browsers but a CLI tool may be better.
[Algolia Atomic](https://github.com/chrisdmacrae/atomic-algolia) is a good choice.
To be compatible with Hugo multilingual mode,
you need to upload different `index.json` for each language to the different index of algolia, such as `zh-cn/index.json` or `fr/index.json`...
{{< /admonition >}}

---

{{< admonition quote "Thanks" >}}
_Thanks to the original author [Dillon](https://dillonzq.com) for preparing and revising the content before version `v0.2.10` in this documentation._
{{< /admonition >}}