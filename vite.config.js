import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    // Base path - empty for Vercel deployment
    base: '/',
    
    plugins: [
      react({
        // Enable React Fast Refresh in development
        fastRefresh: !isProduction,
        // Configure JSX runtime
        jsxRuntime: 'automatic'
      }), 
      tailwindcss()
    ],
    
    // Define environment variables
    define: {
      __DEV__: !isProduction,
    },

    // Development server configuration
    server: {
      port: 5173,
      host: true,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    },

    // Build configuration
    build: {
      // Generate sourcemaps for production debugging
      sourcemap: isProduction ? 'hidden' : true,
      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            editor: ['@monaco-editor/react'],
          }
        }
      },
      // Minification
      minify: isProduction ? 'esbuild' : false,
      // Target modern browsers
      target: 'es2020'
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        'react-redux',
        '@monaco-editor/react'
      ]
    },

    // Environment variables
    envPrefix: 'VITE_',
    // Include 3D model binary assets so imports like `import m from './a.glb'`
    // resolve to a URL instead of attempting JS parsing.
    assetsInclude: ["**/*.glb", "**/*.gltf"],
  }
});