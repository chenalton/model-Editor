/*
 * @Author: cuizhaojian
 * @LastEditors: cuizhaojian
 * @LastEditTime: 2024-12-12 10:57:43
 * @Description: 
 */
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import ESLintPlugin from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    ESLintPlugin(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    open: false,
    hmr: true, // 热更新
    // logLevel: 'info', // 日志等级
    cors: true, // 跨源请求
    proxy: {
      "/modelset": {
        // target: 'https://sijipingtai.eulee.com.cn/modelset/',
        target: "http://10.11.2.205:8280/",
        // target: "http://192.168.32.148:8081/modelset/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/modelset/, ''),
      },
    },
  },
})
