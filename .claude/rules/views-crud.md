---
name: views-crud
description: CRUD 视图模式——index.vue（ms-search-box + el-table + el-pagination）+ components/<Entity>Edit.vue 弹窗，helper 用 inject 注入，操作后判断 status 再 $message + fetchData
paths:
  - src/views/**
---

# CRUD 视图约束

标准目录（参考 `src/views/account/userLevel/`）：`src/views/<module>/<entity>/index.vue` + 同目录 `components/<Entity>Edit.vue`。

## index.vue 必备区块

1. 搜索区：`<ms-search-box>`（library 全局组件，模板直接用，无需 import）
2. `<el-table>` 列表 + `<el-pagination>` 分页
3. 弹窗挂载：`<edit ref="editRef" @fetch-data="fetchData" />`

## 弹窗打开方式

```ts
state.editRef.showEdit(row) // 不传 row 即新增模式
```

## 删除/状态变更的固定套路

```ts
const $confirm = inject('$confirm')!
const $message = inject('$message')!

$confirm(t('你确定要删除当前项吗'), null, async () => {
  const { msg, status } = await doRemove({ user_level_id: row.user_level_id })
  if (200 == status) { $message(msg, 'success') } else { $message(msg, 'error') }
  await fetchData()
})
```

所有变更操作必须：判断 `status == 200` → `$message(msg, ...)` → 重新 `fetchData()`。

## 全局 helper

- 一律 `inject('$confirm') / inject('$message') / inject('$tableHeight')`（由 `library/plugins/ms.ts` provide），不要自行 import ElMessage/ElMessageBox。

## 代码风格

- 现有页面为 `defineComponent` + `reactive`（多数为纯 JS），新页面保持同风格。
- 所有用户可见文案包 `t()`（见 i18n-chinese-keys 规则）。
