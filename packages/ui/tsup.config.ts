import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom', 'overlay-kit', 'sonner', 'gsap'],
  banner: {
    js: '"use client";',
  },
});
