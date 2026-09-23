---
name: dynamic-routing
description: 路由约束——路由/菜单由后端菜单树驱动，静态路由仅限 login/403/404/callback；新页面必须先在后端管理端建菜单
paths:
  - src/router/**
  - src/store/modules/routes.ts
  - src/utils/routes.ts
---

# 动态路由约束

- 静态路由仅限 `src/router/index.ts` 中的 constantRoutes：`/login、/callback、/403、/404`，以及兜底 `/:pathMatch(.*)* → /404`。禁止把业务页面追加进静态路由表。

- 现有流程（不要改变各环节职责与顺序）：
  1. 登录后首次导航，`src/router/permissions.ts` 守卫拉取 `getSysInfo` + `getUserInfo`；
  2. `src/store/modules/routes.ts` 的 `setRoutes()` 调用 `/manage/admin/menu/tree` 获取菜单树；
  3. `src/utils/routes.ts` 的 `convertRouter()` 把后端 `component` 字符串映射为组件（`Layout → @sslib/layouts/index.vue`，其余 → `@/<path>.vue` 动态 import）；
  4. `filterRoutes` 按权限过滤后 `resetRouter()` 注册。

- 新增页面的前置条件：先在后端管理端创建菜单项，菜单 path 必须对应 `src/views/` 下的组件路径。只建前端文件、不建菜单，页面不可达。
