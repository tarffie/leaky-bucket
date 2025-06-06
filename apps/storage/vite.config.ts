// vite.config.ts
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs', 'es'],
      fileName: (format: string) =>
        format === 'es' ? 'index.mjs' : 'index.js',
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['mongodb', 'util', 'crypto', 'path', 'os', 'fs'],
      output: {
        globals: {
          path: 'path',
          os: 'os',
          crypto: 'crypto',
        },
      },
    },
    target: 'node22',
    // Disable minification for debugging
    minify: false,
  },
  // Ensure process.env is available
  define: {
    'process.env': 'process.env',
  },
});
