/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages は /tokyo-hidden-transfers/ サブパスで配信されるため、
// base を設定してビルド成果物のアセットパスを解決する。
export default defineConfig({
  plugins: [react()],
  base: '/tokyo-hidden-transfers/',
  build: {
    // maplibre-gl は必須依存かつ大きいため、チャンクサイズ警告の閾値を緩和する。
    chunkSizeWarningLimit: 1500,
  },
  test: {
    environment: 'node',
    passWithNoTests: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/domain/**/*.ts',
        'src/geojson/**/*.ts',
        'src/data/**/*.ts',
        'src/map/tooltip/tooltipHtml.ts',
      ],
      exclude: ['src/**/*.test.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
