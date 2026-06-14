import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No global Vitest `environment` is set on purpose: tests default to the node
// environment (CharacterStage renders via renderToStaticMarkup). Only the
// Wardrobe test opts into jsdom via a per-file `// @vitest-environment jsdom`
// pragma, so DOM-dependent tests stay isolated to where they're needed.
export default defineConfig({
  plugins: [react()],
})
