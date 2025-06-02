import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      // Ensure 'string_decoder' is included for libraries like cipher-base used by meshsdk
      include: ['buffer', 'events', 'util', 'process', 'stream', 'crypto', 'path', 'assert', 'string_decoder'],
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  // resolve: { // Keep resolve commented out or remove if nodePolyfills handles it
  //   alias: {
  //     buffer: 'buffer',
  //     events: 'events',
  //     util: 'util',
  //     stream: 'stream-browserify',
  //     crypto: 'crypto-browserify',
  //     path: 'path-browserify'
  //   }
  // },
  define: {
    // 'global': 'globalThis', // Let nodePolyfills handle this
    'process.env': {},
    // 'Buffer': ['buffer', 'Buffer'], // Let nodePolyfills handle this
    'process.version': '""'
  },
  optimizeDeps: {
    // include: ['buffer', 'process', 'events', 'stream', 'util', 'assert', 'crypto', 'path', '@meshsdk/core'], // Let nodePolyfills handle includes
    include: ['@meshsdk/core'], // Only include specific non-polyfill deps if needed
    esbuildOptions: {
      // define: { // Let nodePolyfills handle this
      //   global: 'globalThis'
      // }
    }
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      sourceMap: false
    }
  },
  server: {
    sourcemapIgnoreList: (sourcePath) => {
      // Specifically ignore @cardano-sdk paths that have missing source files
      return sourcePath.includes('node_modules') || sourcePath.includes('@cardano-sdk');
    }
  }
})

// ...
