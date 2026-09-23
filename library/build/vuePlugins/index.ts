const { initPlugin } = require('ms-plugin-init')
const { createWebpackBar } = require('./webpackBar/index.ts')
const { createDefineOptions } = require('./defineOptions/index.ts')
const { createDefinePlugin } = require('./definePlugin/index.ts')
const { createProvidePlugin } = require('./providePlugin/index.ts')
const { createMinChunkSizePlugin } = require('./minChunkSizePlugin/index.ts')

const dev = process.env.NODE_ENV === 'development'
module.exports = {
  createVuePlugin: () => [
    ...createDefineOptions(),
    ...initPlugin(),
    require('unplugin-element-plus/webpack')(),
    // [healthmall-ext] webpackbar 6.0.1 与新版 webpack 的 ProgressPlugin schema 不兼容（unknown property 'reporters'），禁用
    ...(process.env.ENABLE_WEBPACK_BAR ? createWebpackBar() : []),
    ...createDefinePlugin(),
    ...createProvidePlugin(),
    ...(dev ? [] : createMinChunkSizePlugin()),
  ],
}
