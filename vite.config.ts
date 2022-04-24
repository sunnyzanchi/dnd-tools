import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    modules: {
      generateScopedName: (name, fileName) =>
        `${path.basename(fileName).split('.')[0]}-${name}`,
      localsConvention: 'camelCaseOnly',
    },
  },
  plugins: [preact()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
})
