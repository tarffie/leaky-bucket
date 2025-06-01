import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths'; // For TypeScript path aliases
import { resolve } from 'path';

// Base configuration for reusability across services
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    // Root directory for the project (relative to the package)
    root: resolve(__dirname),

    // Build configuration
    build: {
      // Output directory for build artifacts
      outDir: 'dist',

      // Empty the output directory before building
      emptyOutDir: true,

      // Library mode for shared packages
      lib: {
        // Entry point for the package
        entry: resolve(__dirname, 'src/main.ts'), // Adjust to your entry file
        name: 'Common', // Global name for UMD builds (if needed)
        formats: ['es', 'cjs'], // Output ESM and CommonJS for compatibility
        fileName: (format) => `common.${format}.js`, // Output file names
      },

      // Minify in production, skip in development for faster builds
      minify: isProduction ? 'esbuild' : false,

      // Source maps for easier debugging
      sourcemap: true,

      // Optimize for monorepo dependencies
      rollupOptions: {
        // Externalize dependencies to avoid bundling them
        external: [
          // List peer dependencies or monorepo packages to exclude from bundle
          ...Object.keys(require('./package.json').dependencies || {}),
          ...Object.keys(require('./package.json').peerDependencies || {}),
        ],
        output: {
          // Preserve module structure for ESM
          preserveModules: false,
          // Ensure interop with CommonJS
          interop: 'auto',
        },
      },

      // Target modern browsers for smaller bundles
      target: 'esnext',
    },

    // Development server configuration
    server: {
      // Port for dev server (optional, for apps using Juno)
      port: 5173,
      // Automatically open browser in dev mode
      open: true,
      // Enable strict mode for better security
      strict: true,
      // Enable CORS for cross-service development
      cors: true,
    },

    // Plugins for enhanced functionality
    plugins: [
      // Support TypeScript path aliases from tsconfig.json
      tsconfigPaths(),
    ],

    // Optimize dependencies for faster builds
    optimizeDeps: {
      include: [
        // Add commonly used dependencies for pre-bundling
        // Example: 'lodash', 'react', etc.
      ],
    },

    // Resolve settings for monorepo compatibility
    resolve: {
      alias: {
        // Example alias for shared utilities
        '@common': resolve(__dirname, 'src'),
        // Add more aliases as needed
      },
    },

    // Environment variables prefix
    envPrefix: 'APP_',

    // Cache build output for faster rebuilds
    cacheDir: 'node_modules/.vite',
  };
});
