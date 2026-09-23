---
name: permissions-directive
description: 按钮权限约束——操作按钮必须加 v-permissions，permission 数组的值是对应后端接口的 URL path，与 url.config.js 注册一致
paths:
  - src/views/**
  - src/components/**
---

# 按钮权限约束

- 会触发接口调用的操作按钮（新增/编辑/删除/导出等）必须加指令：

```html
<el-button v-permissions="{ permission: ['/manage/account/userLevel/add'] }">
  {{ t('添加') }}
</el-button>
```

- `permission` 数组的元素是**后端接口 URL path**，与 `src/config/url.config.js` 中注册的 path 一致，不是自定义权限名称。

- 指令由 `library/plugins/directive.ts` 注册：无权限时直接移除 DOM 节点（不是 disabled/隐藏），因此不要再用 `v-if` 自行判断权限，也不要依赖被移除元素的交互状态。
