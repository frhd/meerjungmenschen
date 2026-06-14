import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No global Vitest `environment` is set on purpose: tests default to the node
// environment (CharacterStage renders via renderToStaticMarkup). Only the
// Wardrobe test opts into jsdom via a per-file `// @vitest-environment jsdom`
// pragma, so DOM-dependent tests stay isolated to where they're needed.
//
// `base` is set for production builds only so assets resolve under the GitHub
// Pages subpath (https://frhd.github.io/meerjungmenschen/). Dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/meerjungmenschen/' : '/',
  plugins: [react()],
}))
