import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

import Components from 'unplugin-vue-components/vite';
import {
  AntDesignVueResolver
} from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000', // 代理目标地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 可选的重写路径
      },
    }
  },
  plugins: [
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    vue(),
    vueJsx(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  }
})
