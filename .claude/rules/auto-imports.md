---
name: auto-imports
description: 自动导入约束——Vue API/axios/pinia/@vueuse/ElMessage 等与全部 el-* 组件由构建插件注入，禁止手写这些 import；例外是 t() 必须显式导入
paths:
  - src/**/*.vue
  - src/**/*.ts
---

# 自动导入约束

由 `library/build/vuePlugins` 的插件链在构建期注入，以下内容**不需要也不能**手写 import（清单见 `auto-imports.d.ts` / `components.d.ts`）：

- Vue 全量 API：`defineComponent, reactive, ref, computed, inject, watch, toRefs, ...`
- 第三方库：`axios`、`pinia`、`@vueuse/core`
- Element Plus 函数式组件：`ElLoading / ElMessage / ElMessageBox / ElNotification`
- 全部 `el-*` Element Plus 组件（模板直接写 `<el-table>` 等）

## 例外（必须显式导入）

```ts
import { translate as t } from '@/i18n' // t 不是自动导入
```

以及所有业务模块：`@/api/*`、`@/config`、`@/utils/*` 照常显式导入。
