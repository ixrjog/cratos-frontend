# 主题开发规范（亮色 / 暗色）

本项目基于 **DevUI** 主题体系，支持**亮色 / 暗色 / 自定义**主题切换。所有页面在开发时都必须同时兼容亮色与暗色，禁止硬编码固定颜色。

---

## 1. 主题是如何工作的

- 主题通过 **DevUI CSS 变量**（`--devui-*`）实现：切换主题时这些变量的取值随之变化，页面颜色自动跟随。
- 当前主题存于 `localStorage.theme`，可能取值：
  - `devui-dark-theme`（暗色）
  - `customize-theme`（自定义，另见 `localStorage.user-custom-theme-config`）
  - 其它/缺省视为亮色
- 判断当前是否暗色：`isDark()`（`src/app/@shared/utils/theme.util.ts`）。

```ts
import { isDark } from 'src/app/@shared/utils/theme.util';
if (isDark()) { /* 暗色分支 */ }
```

---

## 2. 核心规则

1. **不要硬编码颜色**（`#fff`、`#333`、`rgb(...)` 等）。一律使用 DevUI 变量。
2. **CSS/LESS 里用 `var(--devui-*)`**，并带上亮色兜底值：
   ```less
   background: var(--devui-base-bg, #fff);
   color: var(--devui-text, #252b3a);
   border: 1px solid var(--devui-dividing-line, #dfe1e6);
   ```
3. 也可 `@import 'ng-devui/styles-var/devui-var.less';` 后用 **LESS 变量** `@devui-text` / `@devui-base-bg` 等（等价于对应 CSS 变量）。
4. 组件写完后**必须在亮色和暗色两种主题下各自验证**一遍。
5. 允许的例外：**终端/代码控制台**（如 xterm 构建日志）可固定深色背景（`#1e1e1e`），这是终端惯例；但仍建议按需用 `isDark()` 切换主题。

---

## 3. 常用 DevUI 变量速查

| 用途 | 变量 | 亮色兜底 |
| --- | --- | --- |
| 页面/卡片背景 | `--devui-base-bg` | `#fff` |
| 次级/代码块背景 | `--devui-global-bg` | `#f7f8fa` |
| 主文字 | `--devui-text` | `#252b3a` |
| 次要/辅助文字 | `--devui-aide-text` | `#8a8e99` |
| 分割线/边框 | `--devui-dividing-line` | `#dfe1e6` |
| 表单控件边框 | `--devui-line` | `#d7d8da` |
| 品牌色（链接/主按钮） | `--devui-brand` | `#5e7ce0` |
| 品牌激活色 | `--devui-brand-active` | `#3d5fd6` |
| 列表 hover 底色 | `--devui-list-item-hover-bg` | `#f2f3f5` |
| 列表选中底色 | `--devui-list-item-active-bg` | `#e9edfa` |
| 危险/删除色 | `--devui-danger` | `#f66f6a` |
| 占位符 | `--devui-placeholder` | `#adb0b8` |
| 禁用背景/文字 | `--devui-disabled-bg` / `--devui-disabled-text` | `#f7f8fa` / `#adb0b8` |

> 具体全量变量见 `node_modules/ng-devui/styles-var/devui-var.less`。

---

## 4. 组件写法约定

### 4.1 输入框
优先直接用 DevUI 指令 `dTextInput` / `dTextarea`（自带主题）。若必须自定义样式，用变量：
```less
input {
  background: var(--devui-base-bg, #fff);
  color: var(--devui-text, #252b3a);
  border: 1px solid var(--devui-line, #d7d8da);
}
```
> 密码框务必加 `autocomplete="new-password"`，否则浏览器自动填充会强制浅底，暗色下"一会白一会黑"。

### 4.2 弹窗 / 遮罩层
```less
.overlay { background: rgba(0, 0, 0, 0.4); }         /* 遮罩可固定半透明黑 */
.dialog  { background: var(--devui-base-bg, #fff); color: var(--devui-text, #252b3a); }
```

### 4.3 Popover（重点：`appendToBody` 场景）
DevUI 的 `dPopover` 默认 `appendToBody`，会被移出组件 DOM，**组件里的 `::ng-deep` 覆盖不到它的外层容器**（背景/边框）。因此 **popover 外层主题化必须通过 `[popoverStyle]`**，统一用工具函数 `getPopoverStyle()`：

```ts
import { getPopoverStyle } from 'src/app/@shared/utils/theme.util';
export class XxxComponent {
  readonly getPopoverStyle = getPopoverStyle; // 暴露给模板
}
```
```html
<span dPopover [content]="tpl" [popoverStyle]="getPopoverStyle({ width: '520px' })">...</span>
```
- `getPopoverStyle(style?)` 会按当前主题合并 `LIGHT_THEME_POPOVER_STYLE` / `DARK_THEME_POPOVER_STYLE`（见 `src/app/@shared/constant/theme.constant.ts`），并允许追加自定义样式（如宽度）。
- popover **内容**（模板里的元素）仍用组件样式 + `var(--devui-*)` 即可（内容保留组件的 `_ngcontent` 属性，作用域样式生效）。

### 4.4 Markdown / 代码高亮
- Markdown 用 `<markdown>`（ngx-markdown），主题由全局样式处理；自定义 `::ng-deep` 表格/代码块边框时用 `@devui-dividing-line`。
- ACE 编辑器：按 `isDark()` 选 `ace/theme/tomorrow_night`（暗）/ `ace/theme/tomorrow`（亮）。

### 4.5 图标
- 优先 DevUI 图标字体（`icon icon-xxx`）或 `d-icon`（自带主题色）。
- 图标颜色用 `var(--devui-brand)` 等变量，不要写死。
- 图标字形不确定是否存在时（如某些 FontAwesome 子集），确保元素有可点区域，或改用确定存在的 DevUI 图标。

---

## 5. 自查清单（提交前）

- [ ] 无硬编码颜色（终端/代码块深色除外）
- [ ] 所有颜色走 `var(--devui-*)` 或 `@devui-*`
- [ ] 亮色主题下：文字、边框、背景、hover/选中态均清晰可读
- [ ] 暗色主题下：同上
- [ ] `appendToBody` 的 popover 用 `getPopoverStyle()`
- [ ] 密码输入框加 `autocomplete="new-password"`
- [ ] `d-select` 的 `[(activeTab)]`/`ngModel` 等类型与严格模板检查兼容

---

## 6. 相关文件

- `src/app/@shared/utils/theme.util.ts` — `isDark()`、`getPopoverStyle()`
- `src/app/@shared/constant/theme.constant.ts` — popover 主题样式常量
- `node_modules/ng-devui/styles-var/devui-var.less` — 全量 DevUI 变量
- 参考实现：`src/app/pages/workbench/artifact-publish/`（popover 主题化）、`src/app/pages/channel/channel-view/`（列表选中态）
