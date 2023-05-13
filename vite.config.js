import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
// import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // plugins: [vue({
  //   template: { transformAssetUrls }
  // }),
  //   quasar({
  //     sassVariables: 'src/assets/quasar-variables.sass'
  //   })
  // ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.vue']
  },
  server: {
    host: '127.0.0.1', // 本机地址
    port: 8000, // 前端端口
    // 反向代理，跨域
    proxy: {
      '/api': {
        target: 'http://localhost:9000', // 后端部署地址
        changeOrigin: true, // 跨域
        rewrite: path => path.replace(/^\/api/, '') // 替换掉前面axios设置的默认头

      }
    }
  },
})





