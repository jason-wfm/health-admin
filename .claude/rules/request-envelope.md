---
name: request-envelope
description: 请求封包约束——全项目只用 src/utils/request.ts 共享实例，成功判断 status==200，status==250 由拦截器按 code 401/402/403 分流，token 自动附带
paths:
  - src/utils/request.ts
  - src/api/**
---

# 请求封包约束

- 全项目只使用 `src/utils/request.ts` 的共享 axios 实例；禁止新建 axios 实例、禁止 fetch 封装。

- 响应封包为 `{ code, status, msg, data }`，业务成功判断是 `status === 200`（不是 HTTP 状态码）。业务代码直接解构使用：

```ts
const { msg, status, data } = await getList(params)
```

- `status == 250` 由拦截器统一按 `code` 分流，业务代码不要重复处理：
  - `401` → 清空会话并跳 `/login`
  - `402` → token 刷新：`refreshToking` 标志 + `requests` 队列让并发请求排队等待，修改刷新逻辑时必须保持该队列语义（否则并发请求会拿到失效 token）
  - `403` → 跳 `/403`
  - `300`（业务校验失败）等其余 code 直接透传给业务层

- `Authorization: Bearer <token>` 由拦截器自动附加，调用方不要手动设置。
