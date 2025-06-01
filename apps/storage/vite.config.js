import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Storage',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['mongodb', '@woovi/common'],
      output: {
        interop: 'auto',
      },
    },
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@woovi/common': resolve(__dirname, '../common/src'),
    },
  },
});
