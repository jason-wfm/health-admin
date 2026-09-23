---
name: library-vendored
description: library/ 是仓库内供应商化框架层，等同 node_modules——默认不改，业务需求优先在 src/ 解决，仅框架自身扩展才允许修改
paths:
  - library/**
---

# library/ 供应商化约束

- `library/`（`build / components / layouts / plugins / styles`）是内嵌框架层，不是业务代码：Ms* 组件、全局插件（ms.ts、elementPlus、directives、errorLog）、样式、webpack 构建配置都在这里。`vue.config.js` 直接消费 `library/build/index.ts` 的 `createVuePlugin / createChainWebpack`。

- 该目录改动会影响全部页面，默认**不要修改**：业务需求优先在 `src/` 实现；只有扩展框架能力（新增全局插件 / Ms 组件 / 构建规则）才允许改动，且需说明理由。

- Ms* 组件由 library 全局注册，视图模板直接使用（如 `<ms-search-box>`、`<ms-card>`），可用清单：MsApp, MsAppMain, MsArea, MsAvatar, MsBreadcrumb, MsCard, MsColorfulCard, MsColumnBar, MsDateRangePicker, MsDrawer, MsErrorLog, MsFold, MsFooter, MsFullScreen, MsHeader, MsLanguage, MsLink, MsLogo, MsMenu, MsNav, MsNotice, MsRefresh, MsRouterView, MsSearchBox, MsSideBar, MsTabs, MsTree。
