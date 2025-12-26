# FixIt 编码标准和指导原则

本文档定义了 FixIt 主题项目的编码标准、最佳实践和开发指导原则。所有贡献者和 AI 助手在参与项目开发时都应遵循这些规范。

## 项目概述

FixIt 是一个面向 Hugo 静态网站生成器的现代化、响应式主题。项目基于以下技术栈：

- **Hugo**: 静态网站生成器（≥ 0.147.7）
- **SCSS**: CSS 预处理器，用于样式开发
- **JavaScript**: ES6+ 标准，用于前端交互功能
- **Go Templates**: Hugo 模板引擎
- **Node.js**: 开发环境和构建工具
- **pnpm**: 包管理器

## 目录结构约定

```
FixIt/
├── apps/               # 最小化站点
│   ├── demo/           # 演示站点
│   └── test/           # 测试站点
├── archetypes/         # 内容模板
├── assets/             # 主题资源文件
│   ├── css/            # SCSS 样式文件
│   ├── js/             # JavaScript 文件
│   ├── images/         # 图像资源
│   └── lib/            # 第三方库
├── i18n/               # 国际化翻译文件
├── layouts/            # Hugo 模板文件
│   ├── _markup/        # Hugo 渲染钩子
│   ├── _partials/      # 可复用模板组件
│   └── _shortcodes/    # 自定义短代码
├── packages/           # 主题相关包
├── static/             # 静态文件
├── hugo.toml           # 主题默认配置
└── package.json        # npm 脚本和依赖
```

## SCSS/CSS 编码规范

### 文件组织结构

1. **主入口文件**: `assets/css/style.scss`
2. **变量文件**: `assets/css/_variables.scss` - 全局变量定义
3. **覆写文件**: `assets/css/_override.scss` - 用户自定义覆写
4. **组织结构**:
   - `_core/`: 核心样式（基础、布局、媒体查询等）
   - `_mixin/`: SCSS mixins 和函数
   - `_page/`: 页面特定样式
   - `_partials/`: 组件样式
   - `_shortcodes/`: 短代码样式

### 命名约定

1. **CSS 类名**: 使用 BEM 方法论或语义化命名

   ```scss
   .header-desktop {}
   .menu-item {}
   .single-title {}
   .post-tag {}
   ```

2. **SCSS 变量**: 使用连字符分隔，语义化命名

   ```scss
   $global-font-family: system-ui, sans-serif;
   $code-background-color: #f6f8fa;
   $header-height: 3.5rem;
   ```

3. **CSS 自定义属性**: 使用前缀约定

   ```scss
   $prefix: fi-;
   $rootPrefix: --fi-;
   ```

### 样式组织原则

1. **主题切换支持**: 使用 CSS 变量实现主题切换

   ```scss
   .element {
     color: var(#{$rootPrefix}global-font-color);
   }
   ```

2. **Mixin 使用**: 提高代码复用性

   ```scss
   @include border-radius($global-border-radius);
   @include transition(all 0.2s ease);
   @include blur;
   ```

### 代码质量要求

1. **缩进**: 使用 2 个空格
2. **注释**: 为复杂逻辑添加注释
3. **颜色**: 使用变量而非硬编码颜色值
4. **单位**: 优先使用相对单位（rem、em、%）

## JavaScript 编码规范

### 代码风格

1. **ES6+ 标准**: 使用现代 JavaScript 语法
2. **模块化**: 使用 ES6 模块系统

### 文件组织

1. **主题核心**: `assets/js/theme.js` - 主题核心逻辑
2. **工具函数**: `assets/js/util.js` - 通用工具函数
3. **特定功能**: 按功能划分独立模块

### 编码实例

```javascript
// 使用 ES6 类
export default class Util {
  copyText(text) {
    // ...
  }
}

// 主题类组织
class FixIt {
  constructor() {
    this.config = window.config
    this.util = new Util()
  }

  init() {
    this.initTheme()
    this.initComponents()
  }
}
```

### 最佳实践

1. **错误处理**: 使用 try-catch 处理异常
2. **异步操作**: 优先使用 async/await
3. **事件处理**: 合理使用事件委托
4. **性能优化**: 避免不必要的 DOM 操作

## Hugo 模板规范

### 模板组织

1. **布局模板**: `layouts/` 目录下的主要模板
2. **局部模板**: `layouts/_partials/` 下的可复用组件
3. **短代码**: `layouts/_shortcodes/` 下的内容短代码

### 编码约定

1. **变量命名**: 使用驼峰命名法

   ```go-html-template
   {{- $footerConfig := .Site.Params.footer -}}
   {{- $fingerprint := .Site.Store.Get "fingerprint" -}}
   ```

2. **注释规范**: 使用 Hugo 注释语法

   ```go-html-template
   {{- /* 这是模板注释 */ -}}
   {{- /*
     多行注释
     可以跨越多行
    */ -}}
   ```

3. **条件判断**: 清晰的条件结构

   ```go-html-template
   {{- if ne $config.enable false -}}
     <!-- 内容 -->
   {{- end -}}
   ```

4. **循环遍历**: 合理使用 range

   ```go-html-template
   {{- range $index, $value := .Site.Languages -}}
     <!-- 处理逻辑 -->
   {{- end -}}
   ```

### 国际化处理

1. **翻译函数**: 使用 `T` 函数

   ```go-html-template
   {{ T "header.switchTheme" }}
   ```

2. **多语言支持**: 考虑多语言环境

   ```go-html-template
   {{- if hugo.IsMultilingual -}}
     <!-- 多语言逻辑 -->
   {{- end -}}
   ```

## 开发工作流程

### 环境设置

1. **前置要求**:
   - Node.js (≥ 20.0.0)
   - Hugo Extended (≥ 0.147.7)
   - pnpm (包管理器)

2. **开发命令**:

   ```bash
   pnpm dev:demo      # 启动 demo 站点开发服务器
   pnpm dev:test      # 启动 test 站点开发服务器
   pnpm dev:docs      # 启动文档开发服务器（需有 fixit-docs 作为同级目录）
   pnpm build:demo    # 构建 demo 站点
   pnpm build:test    # 构建 test 站点
   pnpm build         # 一键构建所有站点
   pnpm preview       # 预览构建后的站点（需先构建）
   ```

### 代码质量

1. **代码审查**: 提交前进行自我审查
2. **测试验证**: 在多个环境中测试功能
3. **文档更新**: 必要时更新相关文档
4. **向后兼容**: 确保更改不破坏现有功能

### Git 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新增功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或工具相关
```

## 性能优化指导

### CSS 性能

1. **选择器优化**: 避免过深的嵌套
2. **媒体查询**: 合理组织响应式断点
3. **动画优化**: 使用 transform 和 opacity
4. **资源压缩**: 生产环境启用压缩

### JavaScript 性能

1. **延迟加载**: 非关键脚本使用 defer
2. **事件优化**: 合理使用防抖和节流
3. **内存管理**: 及时清理事件监听器
4. **模块化**: 按需加载功能模块

### Hugo 模板性能

1. **缓存策略**: 合理使用 Hugo 缓存机制
2. **资源处理**: 优化图片和静态资源
3. **构建优化**: 减少不必要的模板处理

## 可访问性要求

1. **语义化 HTML**: 使用正确的 HTML 标签
2. **ARIA 属性**: 为复杂组件添加 ARIA 支持
3. **键盘导航**: 确保键盘可访问性
4. **颜色对比**: 满足 WCAG 对比度要求
5. **屏幕阅读器**: 提供适当的文本替代

## 浏览器兼容性

1. **目标浏览器**: 支持现代浏览器
2. **渐进增强**: 基础功能向下兼容
3. **特性检测**: 使用特性检测而非浏览器检测
4. **Polyfill**: 必要时提供 polyfill 支持

## 安全考虑

1. **XSS 防护**: 正确处理用户输入
2. **CSRF 保护**: 表单提交安全
3. **内容安全**: 合理设置 CSP 策略
4. **依赖安全**: 定期更新依赖包

## 文档要求

1. **代码注释**: 复杂逻辑必须注释
2. **API 文档**: 公共方法需要文档
3. **使用示例**: 提供清晰的使用示例
4. **更新日志**: 重要更改记录在 CHANGELOG

## 第三方库管理

1. **依赖选择**: 优先选择轻量、维护活跃的库
2. **版本管理**: 及时更新安全补丁
3. **许可证**: 确保许可证兼容性
4. **定制化**: 必要时进行本地化修改

## 贡献指导

1. **讨论优先**: 重大更改前先讨论
2. **小步迭代**: 避免大规模重构
3. **测试覆盖**: 新功能需要充分测试
4. **文档同步**: 功能和文档同时更新

遵循这些编码标准将有助于维护代码质量，提高开发效率，并确保项目的长期可维护性。
