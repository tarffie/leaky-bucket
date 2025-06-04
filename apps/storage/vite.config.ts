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
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.js'),
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Ensure Node.js built-ins are not externalized
      external: [],
      output: {
        globals: {
          path: 'path',
          os: 'os',
          crypto: 'crypto',
          util: 'util', // Add util to fix promisify
        },
      },
    },
    // Target Node.js v24
    target: 'node24',
    // Disable minification for debugging
    minify: false,
  },
  // Ensure process.env is available
  define: {
    'process.env': 'process.env',
  },
});
