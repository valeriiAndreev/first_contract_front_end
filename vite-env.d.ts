// vite-env.d.ts
/// <reference types="vite/client" />

declare module 'vite-plugin-node-polyfills' {
  export function nodePolyfills(): import('vite').Plugin;
}

