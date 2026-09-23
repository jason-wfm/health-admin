---
name: api-layer
description: API 层约束——URL 先注册到 url.config.js，src/api 按实体薄封装，GET 用 params、POST 用 data，字段 snake_case
paths:
  - src/api/**
  - src/config/url.config.js
---

# API 层约束

## 新增接口的固定顺序

1. 先在 `src/config/url.config.js` 对应模块对象下注册 URL。现有顶层模块（不要另起新的顶层 key）：`admin, sys, account, pt, pay, cms, edu, live, marketing, page, analytics, trade, shop`。
2. 再在 `src/api/<module>/<entity>.ts` 写薄封装，通过 `URL.<module>.<entity>.<action>` 引用。禁止在 api 文件或视图组件中硬编码 URL 字符串。

## 标准写法（与现有代码保持一致）

```ts
import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({ url: URL.admin.menu.list, method: 'get', params })
}
export function doAdd(data: any) {
  return request({ url: URL.admin.menu.add, method: 'post', data })
}
```

- GET 一律传 `params`，POST 一律传 `data`（序列化由共享实例处理）。
- 函数命名沿用现有集合：`getList / getTree / getInfo / doAdd / doEdit / doRemove / doRemoveBatch / editState`；实体特有操作可用领域命名（如 `passWordEdit`），但标准增删改查不要另造名字。

## 字段命名

- 请求/响应字段一律 `snake_case`（如 `brand_name`），实体主键为 `<entity>_id`（如 `user_level_id`）。
- api 层保持薄封装：不做 camelCase 转换、不做数据重塑。

## 禁止

- 视图组件直接 `import axios` 或绕过 `@/utils/request` 发请求。
- 在 `url.config.js` 之外散落接口 URL 字符串。
