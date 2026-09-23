---
name: build-config
description: 构建与全局配置约束——Vue CLI(webpack) 非 Vite；配置统一从 @/config 导入；cli.config.js 改端口/输出目录需重启 dev server；后端地址走 .env
paths:
  - vue.config.js
  - src/config/**
  - library/build/**
  - package.json
  - .env.*
---

# 构建与全局配置约束

- 构建体系是 **Vue CLI / webpack**（`vue.config.js` + `library/build/`），不是 Vite：不要引入 vite 专属的配置、插件或语法。

- `src/config/index.js` 合并 `cli / setting / theme / url / httpCode / stateCode / event` 子配置，使用时统一 `import { URL, ... } from '@/config'`，不要绕过入口直接引子配置文件。

- 关键值在 `src/config/cli.config.js`：`devPort: 16000`、`outputDir: 'admin'`、`assetsDir: 'static'`、`publicPath: ''`。修改 port / outputDir / publicPath 后必须重启 dev server 才生效。

- 后端地址通过 `.env.dev / .env.prod` 的 `VUE_APP_BASE_URL / VUE_APP_API_URL` 切换，不要把后端地址硬编码进代码。

- 登录口令 RSA 加密链路：`setting.config.js` 中 `loginRSA: true`，`src/api/login.ts` 调用 `src/utils/encrypt.ts`（JSEncrypt，公钥来自 `getPublicKey()` 接口）加密 password。改动登录/注册相关代码时必须保持该加密行为。
