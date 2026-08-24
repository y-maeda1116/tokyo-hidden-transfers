/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages は /tokyo-hidden-transfers/ サブパスで配信されるため、
// base を設定してビルド成果物のアセットパスを解決する。
// dev ブランチは /tokyo-hidden-transfers/dev/ に配置するため、CI で VITE_BASE を上書きする。
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/tokyo-hidden-transfers/',
  build: {
    // maplibre-gl は必須依存かつ大きいため、チャンクサイズ警告の閾値を緩和する。
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // MapLibre v6 の worker.mjs は "./maplibre-gl-shared.mjs"（ハッシュなし）を
        // 静的 import する。Vite は既定でハッシュ付きで出力するため、ファイル名を固定して
        // worker の import パスと一致させないと本番で 404 になる。
        assetFileNames: (assetInfo) => {
          // assetInfo.name は Rollup の型上 undefined になり得るため null check する
          if (assetInfo.name && assetInfo.name === 'maplibre-gl-shared.mjs') {
            return 'assets/maplibre-gl-shared.mjs'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
  test: {
    environment: 'node',
    passWithNoTests: true,
    // scripts/ 配下のビルドスクリプト純粋関数（rail-coords 等）もテスト対象にする。
    // coverage は論理層（src）のみ計測。
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
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
