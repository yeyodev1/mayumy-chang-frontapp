import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

// Identifica cada build: el front lo compara con /version.json para avisar que hay una nueva.
const APP_VERSION = new Date().toISOString()

function versionFile(): Plugin {
  return {
    name: 'version-file',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: APP_VERSION }) })
    },
  }
}

export default defineConfig({
  plugins: [vue(), versionFile()],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
  server: {
    port: 5277,
    strictPort: true,
    // Hosts desde los que se sirve el dev server a través de túneles (cloudflared).
    allowedHosts: ['.bakano.ec', '.trycloudflare.com'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Solo tokens, funciones y mixins: este archivo se antepone a CADA bloque
        // <style lang="scss">, así que nada que emita CSS puede vivir ahí.
        // El reset y las custom properties están en global.scss, que se importa
        // una sola vez desde main.ts.
        additionalData: `@use "@/styles/index.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
  },
})
