import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'
import { fileURLToPath, URL } from 'node:url'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  electron({
    main: {
      entry: 'electron/main.js',
    },
    preload: {
      input: 'electron/preload.mjs',
    },
  }),

  ], resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }, assetsInclude: ['**/*.db'], // 此行放在 preload 对象内部
})
