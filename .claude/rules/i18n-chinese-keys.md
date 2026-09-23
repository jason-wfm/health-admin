---
name: i18n-chinese-keys
description: i18n 约束——中文原文即 key，t() 必须从 @/i18n 导入，译文写入 locales/<lang>.json 的 msI18n 对象，zh 不需要条目
paths:
  - src/views/**
  - src/i18n/**
---

# i18n 约束

- 所有用户可见文案必须包在 `t('<中文原文>')` 中：文本插值 `{{ t('添加') }}`、属性绑定 `:placeholder="t('请输入等级名称')"`。
- `t` 按文件显式导入（不是全局属性，漏 import 会直接报错）：

```ts
import { translate as t } from '@/i18n'
```

- 中文原文即 key：`translate()` 按 `[lang, 'msI18n', <中文原文>]` 查词典，查不到时回退显示中文原文。因此：
  - `zh` 语言不需要任何词条；
  - 其他语言的翻译写入 `src/i18n/locales/<lang>.json` 顶层唯一的 `msI18n` 对象（如 `en.json`），key 就是中文原文。

## 禁止

- 用英文或拼音当 key。
- 在视图中手写翻译回退逻辑（框架已内置）。
- 硬编码不经过 `t()` 的裸中文/裸英文文案。
