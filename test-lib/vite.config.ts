import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',  // Set a fixed name for the JS file
        chunkFileNames: 'assets/[name].js', // Set a fixed name pattern for chunks
        assetFileNames: 'assets/[name].[ext]' // Set a fixed name pattern for assets
      }
    }
  },
});
