import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        '**/AppData/Local/Microsoft/Edge/**',
        '**/node_modules/**',
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'ignore-edge-files',
          setup(build) {
            build.onResolve({ filter: /.*AppData.*Edge.*/ }, () => ({ external: true }))
          },
        },
      ],
    },
  },
})
