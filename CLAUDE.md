# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HealthMall 商城后台管理端 (e-commerce admin panel). Vue 3 + Element Plus + Pinia + TypeScript, built with Vue CLI (webpack, not Vite). The backend is a separate project (Java/PHP/Golang) — this repo only consumes its REST API. UI text and code comments are in Chinese.

The git root is the parent directory `frontend/`, which also contains the sibling `mobile/` (uniapp) project.

## Commands

```bash
npm run dev          # Dev server at http://localhost:16000 (--mode dev, uses .env.dev)
npm run build        # Production build (--mode prod, outputs to admin/ dir)
npm run lint         # ESLint via vue-cli-service
npm run test:unit    # Jest (no test files currently exist)
```

Backend API target is set via `VUE_APP_BASE_URL` / `VUE_APP_API_URL` in `.env.dev` / `.env.prod` (defaults to the public demo `https://demo.modulithshop.cn`; login demo / shopsuite.cn).

## Path Aliases

- `@` → `src/`
- `~` → project root (note: `~/library` in main.ts refers to `admin/library`)
- `/#` → `types/`
- `@sslib` → `library/`
- `@gp` → `library/plugins/ms` (exports `gp` global helpers)

## Auto-imports

Vue APIs (`defineComponent`, `reactive`, `ref`, `computed`, `inject`, ...), `axios`, and all `el-*` Element Plus components are available without imports — injected at build time via the plugin chain in `library/build/`. Do not add import statements for these in view components.

## Architecture

### Backend-driven dynamic routing

Routes/menus are NOT defined statically. On first navigation after login, the guard in `src/router/permissions.ts` fetches site config (`getSysInfo`) and user info, then `src/store/modules/routes.ts` `setRoutes()` fetches the menu tree from the backend (`/manage/admin/menu/tree`), converts it via `convertRouter` in `src/utils/routes.ts`, filters it by role permissions, and registers it with `resetRouter()`. Static routes are only login/403/404/callback. Adding a page requires a corresponding menu entry in the backend admin (menu paths map to view components).

### API layer (three pieces)

1. **`src/config/url.config.js`** — single centralized registry of all endpoint URLs, nested by backend module. To call a new endpoint, add its URL here first.
2. **`src/api/<module>/<entity>.ts`** — one file per entity exporting thin wrappers (`getList`, `doAdd`, `doEdit`, `doRemove`, `editState`, ...) over the shared axios instance. GET uses `params`; POST uses `data` (form-urlencoded, qs-stringified by default).
3. **`src/utils/request.ts`** — axios instance with interceptors: attaches `Authorization: Bearer <token>`, handles the `{ code, status, msg, data }` response envelope. `status == 200` = success; `status == 250` routes by `code`: 401 → logout to /login, 402 → token refresh (queues concurrent requests while refreshing), 403 → /403.

### Backend module abbreviations

Used consistently in `src/api/`, `src/views/`, and `url.config.js`: `pt` (product/catalog), `trade` (orders), `pay` (payments/consume), `account` (users), `cms` (articles), `sys` (system config), `shop` (store/shipping), `analytics`, `marketing` (activities), `o2o` (chain stores), `sns`, `admin` (admin users/menus/roles).

### View page pattern

Standard CRUD pages live at `src/views/<module>/<entity>/index.vue` (list + search + el-table + pagination) with an edit dialog in `components/<Entity>Edit.vue` opened via `editRef.showEdit(row)`. Views are mostly Options-less `defineComponent` + `reactive` (many in plain JS). Global helpers are obtained via `inject('$confirm')`, `inject('$message')`, `inject('$tableHeight')` (provided from `library/plugins/ms.ts`; also available as `gp.$confirm` etc.). After mutations, check `status == 200`, show `$message(msg, 'success'|'error')`, then re-`fetchData()`.

### Permissions

Button-level control via the `v-permissions` directive; the permission string is the backend API URL path, e.g. `v-permissions="{ permission: ['/manage/pt/productBrand/add'] }"`. Elements without permission are removed from the DOM.

### i18n

vue-i18n with **Chinese source text as the key**: UI strings are written as `t('品牌名称')`. `translate()` looks up `messages[lang].msI18n[<Chinese key>]` and falls back to the Chinese text itself, so translations go in `src/i18n/locales/en.json` etc. under the `msI18n` object; `zh` needs no entries. Always wrap user-visible strings in `t(...)`.

### library/ (in-repo UI framework)

`library/` is a vendored framework layer (not node_modules): `Ms*` components (MsSearchBox, MsCard, MsMenu, layouts...), global plugins (ms.ts helpers, elementPlus, directives, errorLog), styles, and the webpack build config consumed by `vue.config.js` (`createVuePlugin` / `createChainWebpack`). Treat it like `node_modules` — prefer changes in `src/` unless extending the framework itself.

### Global config

`src/config/index.js` merges `cli/setting/theme/url/httpCode/stateCode/event.config.js` — import settings from `@/config` (token storage, loginRSA, routesWhiteList, `loginInterception`, layout defaults, etc.). Changes to `cli.config.js` (port, outputDir, publicPath) require a dev-server restart.

## Conventions

- API request/response fields are `snake_case` (`brand_id`, `brand_name`); entity primary key is `<entity>_id`.
- Comments and commit-relevant docs are in Chinese — follow suit.
- `loginRSA: true` — login passwords are RSA-encrypted client-side (`src/utils/encrypt.ts`).

# 文档生成规范

## 文档结构
- 每个页面生成独立的 `.md` 文件，放在 `docs/pages/` 下
- 每个组件生成独立的 `.md` 文件，放在 `docs/components/` 下
- 生成一个总览文档 `docs/OVERVIEW.md`，用 Mermaid 绘制页面-组件关系图

## 页面文档必须包含
- 页面路由路径
- 页面功能描述
- 使用的组件列表（含组件名和文件路径）
- 页面级状态管理说明
- API 调用列表

## 组件文档必须包含
- 组件 Props 表格（名称、类型、默认值、说明）
- Emits/Events 列表
- 使用示例代码
- 依赖的子组件

## 生成命令
用户说“生成文档”时，执行以下步骤：
1. 扫描 src/pages/ 和 src/components/ 目录
2. 分析每个文件的 import 关系，建立组件依赖图
3. 按上述结构生成 Markdown 文件
4. 在 OVERVIEW.md 中用 Mermaid 生成关系图
