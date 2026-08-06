# 都バス全系統プロット — Plan 2: アプリ統合（lazy fetch）実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Plan 1 で生成した都営バス全系統 GeoJSON（約4MB）を lazy fetch で読み込み、鉄道路線図と同じ地図上に都バス全系統（路線・停留所）をプロットする。トグル・ズーム制御付き。

**Architecture:** バスデータは `public/data/` から配信し、都バストグル ON ＋ ズーム到達を契機に1回だけ fetch（zod 検証）。鉄道レイヤーの下に `minzoom` 付きで重ね、`busVisible` 状態で表示切替。手定義の草43（`kusa43Line`）は廃止して GTFS 全系統に一本化する（ユーザー合意: 草43の徒歩乗換 transfer 2件は全系統プロットで自明なため削除）。

**Tech Stack:** TypeScript 7 / React 19 / MapLibre GL JS 6 / zod 4 / Vitest

**設計との差分（規模実測結果に基づく変更）:**
- **ロード方式**: 設計§4.1 の `vite import` → **lazy fetch**（`public/data/` 配信）。実データが約4MB（routes 2.5MB/763 features、stops 1.5MB/5370 features）で、バンドル同梱は初期ロードを著しく重くするため（規模記録 `docs/superpowers/plans/bus-data-size.md`）。
- **草43乗換の扱い**: 設計§8 は「transfers.ts の草43乗換2件を GTFS 側停留所 ID に更新」としていたが、**削除**に変更。全系統プロットで停留所が点表示されるため徒歩連絡は視覚的に自明。GTFS 側停留所 ID を `stationsById`（`lines` から構築）へ統合する複雑な仕組みが不要になる。
- **`src/data/bus/index.ts`**: Plan 1 Task 10（import 版）は未作成のままスキップ。本計画で lazy fetch 版 `busData.ts` を新設する。

---

## File Structure

**Create:**
- `public/data/bus-routes.json` — `src/data/bus/` から移動（lazy fetch 配信元）
- `public/data/bus-stops.json` — 同上
- `src/data/bus/busData.ts` + `.test.ts` — lazy fetch + zod 検証（純粋関数、TDD・coverage 対象）
- `src/map/useBusLayers.ts` — fetch トリガ・レイヤー追加・visibility 切替・hover を統合する React フック
- `src/ui/BusToggle.tsx` — 都バス ON/OFF トグル（`SuspensionToggle` と同パターン）

**Modify:**
- `scripts/build-bus-geojson.ts` — 出力先を `public/data` へ変更
- `src/map/layerStyles.ts` — `SOURCE_IDS`/`LAYER_IDS` に都バス追加、`busRoutesLayer`/`busStopsLayer`、`DEFAULT_BUS_COLOR` 定数
- `src/map/addDataLayers.ts` — `addBusLayers` 関数を追加
- `src/map/MapContainer.tsx` — `busVisible` props 追加、`useBusLayers` 呼出
- `src/map/tooltip/tooltipHtml.ts` — `buildBusRouteTooltip` 追加（TDD・coverage 対象）
- `src/map/tooltip/tooltipHtml.test.ts` — 上記のテスト
- `src/App.tsx` — `busVisible` 状態、`BusToggle` 配置、`MapContainer`/`Legend` へ props
- `src/ui/Legend.tsx` — `busVisible` 連動・テキスト更新・GTFS クレジット
- `src/ui/Header.tsx` — subtitle 更新
- `src/index.css` — `.bus-toggle` スタイル
- `src/data/index.ts` — `kusa43Line` の import/配列参照を削除
- `src/data/transfers.ts` — 草43乗換2件を削除
- `src/data/index.test.ts` — 路線数 24→23
- `README.md` — コンセプト・編集ルール・mode 表・GTFS クレジット

**Delete:**
- `src/data/bus/bus-routes.json`（`public/data/` へ移動）
- `src/data/bus/bus-stops.json`（同上）
- `src/data/lines/kusa43Line.ts`（草43廃止）

---

### Task 1: バス GeoJSON を public/data 配信へ移動

lazy fetch の配信元として、バス GeoJSON をバンドル対象（`src/`）から静的配信（`public/`）へ移す。

**Files:**
- Modify: `scripts/build-bus-geojson.ts:2,16`
- Move: `src/data/bus/bus-routes.json` → `public/data/bus-routes.json`
- Move: `src/data/bus/bus-stops.json` → `public/data/bus-stops.json`

- [ ] **Step 1: build:bus の出力先を public/data に変更**

`scripts/build-bus-geojson.ts` の以下2箇所を変更する。

1行目のコメント（ファイル先頭）:
```typescript
// 都営バス GTFS-JP zip を読み込み、路線・停留所 GeoJSON（.json）を public/data/ に出力する。
```

`outDir` 定義（16行目付近）:
```typescript
const outDir = resolve(projectRoot, 'public/data')
```

- [ ] **Step 2: 既存 JSON を public/data へ移動**

Run:
```bash
mkdir -p public/data
git mv src/data/bus/bus-routes.json public/data/bus-routes.json
git mv src/data/bus/bus-stops.json public/data/bus-stops.json
```
Expected: `public/data/bus-routes.json`, `public/data/bus-stops.json` が存在し、`src/data/bus/` からは消えている。

- [ ] **Step 3: .gitignore が public/data/*.json を除外していないことを確認**

Run: `git check-ignore public/data/bus-routes.json`
Expected: 何も出力されない（除外対象ではない＝コミット対象）。除外されていたら `.gitignore` の該当行を削除する。`toei-gtfs.zip` は引き続き除外のまま（成果物のみコミット）。

- [ ] **Step 4: 型チェック（scripts 含む）**

Run: `npm run typecheck`
Expected: エラーなし（`outDir` の変更のみで型影響なし）

- [ ] **Step 5: Commit**

```bash
git add scripts/build-bus-geojson.ts public/data/bus-routes.json public/data/bus-stops.json
git commit -m "refactor(bus): バス GeoJSON を public/data 配信へ移動（lazy fetch 対応）"
```

---

### Task 2: busData.ts（lazy fetch + zod 検証）— TDD

`public/data/` のバス GeoJSON を fetch し、`FeatureCollectionSchema` で検証する。`base`（`import.meta.env.BASE_URL`）を注入可能にし、GitHub Pages サブパスに対応する。fetch 実体もテスト注入可能にする（coverage 対象: `src/data/**`、80% 閾値）。

**Files:**
- Create: `src/data/bus/busData.ts`
- Test: `src/data/bus/busData.test.ts`

- [ ] **Step 1: 失敗テストを書く**

```typescript
// src/data/bus/busData.test.ts
import { describe, expect, it, vi } from 'vitest'
import { busDataUrl, fetchBusData } from './busData.ts'

describe('busDataUrl', () => {
  it('base 付きの URL を生成する', () => {
    expect(busDataUrl('/tokyo-hidden-transfers/', 'routes')).toBe(
      '/tokyo-hidden-transfers/data/bus-routes.json',
    )
    expect(busDataUrl('/tokyo-hidden-transfers/dev/', 'stops')).toBe(
      '/tokyo-hidden-transfers/dev/data/bus-stops.json',
    )
  })
})

describe('fetchBusData', () => {
  const routesFc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [[139.7, 35.7], [139.8, 35.8]] },
        properties: { kind: 'bus-route', shortName: '上26', color: '#00853F' },
      },
    ],
  }
  const stopsFc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [139.7, 35.7] },
        properties: { kind: 'bus-stop', stopId: '0032', name: '浅草雷門' },
      },
    ],
  }

  it('正常系: routes/stops を fetch し zod 検証して返す', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(routesFc) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(stopsFc) })
    const data = await fetchBusData(
      '/tokyo-hidden-transfers/',
      fetchImpl as unknown as typeof fetch,
    )
    expect(data.routes.type).toBe('FeatureCollection')
    expect(data.routes.features).toHaveLength(1)
    expect(data.stops.features[0].properties?.name).toBe('浅草雷門')
  })

  it('異常系: HTTP エラーは throw する', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({}) })
    await expect(
      fetchBusData('/tokyo-hidden-transfers/', fetchImpl as unknown as typeof fetch),
    ).rejects.toThrow()
  })

  it('異常系: 不正 GeoJSON は zod 検証で throw する', async () => {
    const bad = { type: 'NotACollection', features: [] }
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(bad) })
    await expect(
      fetchBusData('/tokyo-hidden-transfers/', fetchImpl as unknown as typeof fetch),
    ).rejects.toThrow()
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npx vitest run src/data/bus/busData.test.ts`
Expected: FAIL（`busData is not defined` / モジュールなし）

- [ ] **Step 3: 実装を書く**

```typescript
// src/data/bus/busData.ts
import type { FeatureCollection } from 'geojson'
import { FeatureCollectionSchema } from '../../domain/geojsonSchema.ts'

/**
 * base（import.meta.env.BASE_URL、末尾スラッシュ付き）と種別から fetch URL を生成する。
 * GitHub Pages のサブパス（/tokyo-hidden-transfers/、dev は /tokyo-hidden-transfers/dev/）に対応。
 */
export function busDataUrl(base: string, kind: 'routes' | 'stops'): string {
  return `${base}data/bus-${kind}.json`
}

/** lazy fetch した都バス全系統データ（zod 検証済み・イミュータブル）。 */
export interface BusData {
  readonly routes: FeatureCollection
  readonly stops: FeatureCollection
}

/**
 * public/data/ のバス GeoJSON を fetch し、FeatureCollectionSchema で検証して返す。
 * fetchImpl はテストで注入可能（本番はグローバル fetch）。
 * HTTP エラー・スキーマ違反時は throw する（フェイルファスト）。
 */
export async function fetchBusData(
  base: string,
  fetchImpl: typeof fetch = fetch,
): Promise<BusData> {
  const [routesRes, stopsRes] = await Promise.all([
    fetchImpl(busDataUrl(base, 'routes')),
    fetchImpl(busDataUrl(base, 'stops')),
  ])
  if (!routesRes.ok) {
    throw new Error(`バス路線データの取得に失敗しました（HTTP ${routesRes.status}）`)
  }
  if (!stopsRes.ok) {
    throw new Error(`バス停留所データの取得に失敗しました（HTTP ${stopsRes.status}）`)
  }
  const [routesJson, stopsJson] = await Promise.all([
    routesRes.json(),
    stopsRes.json(),
  ])
  return {
    routes: FeatureCollectionSchema.parse(routesJson),
    stops: FeatureCollectionSchema.parse(stopsJson),
  }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/data/bus/busData.test.ts`
Expected: PASS（5/5）

- [ ] **Step 5: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 6: Commit**

```bash
git add src/data/bus/busData.ts src/data/bus/busData.test.ts
git commit -m "feat(bus): 都バス GeoJSON の lazy fetch と zod 検証を追加"
```

---

### Task 3: layerStyles.ts に都バスレイヤー定義

`SOURCE_IDS`/`LAYER_IDS` に都バスを追加し、`busRoutesLayer`（line・minzoom 12）/`busStopsLayer`（circle・minzoom 14）と既定色定数を定義する。設計§6 準拠。

**Files:**
- Modify: `src/map/layerStyles.ts`

- [ ] **Step 1: SOURCE_IDS / LAYER_IDS に都バスを追加**

`src/map/layerStyles.ts` の `SOURCE_IDS` と `LAYER_IDS` を以下に置き換える:

```typescript
export const SOURCE_IDS = {
  lines: 'lines-source',
  transfers: 'transfers-source',
  stations: 'stations-source',
  busRoutes: 'bus-routes-source',
  busStops: 'bus-stops-source',
} as const

export const LAYER_IDS = {
  lines: 'lines-layer',
  transfers: 'transfers-layer',
  stations: 'stations-layer',
  busRoutes: 'bus-routes-layer',
  busStops: 'bus-stops-layer',
} as const
```

- [ ] **Step 2: 既定色定数と都バスレイヤー関数を追加**

既存の `SUSPENDED_COLOR` 定数の下（`stationsLayer` の前に）に、都バス既定色とレイヤー関数を追加する:

```typescript
/** 都営バス標準色（停留所の既定色・GTFS の route_color が停留所には無いため）。 */
const DEFAULT_BUS_COLOR = '#00853F'

// 都バス路線: 路線色（feature.properties.color）、細線・半透明。ズーム12以上で描画。
export const busRoutesLayer = (): LineLayerSpecification => ({
  id: LAYER_IDS.busRoutes,
  type: 'line',
  source: SOURCE_IDS.busRoutes,
  minzoom: 12,
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: {
    'line-color': ['get', 'color'],
    'line-width': 2,
    'line-opacity': 0.7,
  },
})

// 都バス停留所: 小さな円。停留所 Feature は路線色を持たないため固定色。ズーム14以上。
export const busStopsLayer = (): CircleLayerSpecification => ({
  id: LAYER_IDS.busStops,
  type: 'circle',
  source: SOURCE_IDS.busStops,
  minzoom: 14,
  paint: {
    'circle-radius': 4,
    'circle-color': DEFAULT_BUS_COLOR,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff',
  },
})
```

※ 既存の `linesPaint` にある `mode==='bus'` ブランチは、草43廃止（Task 10）後に該当 feature が無くなり dead logic になるが、無害のため本計画では残置する（tram など他 mode の拡張余地を残す）。

- [ ] **Step 3: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 4: Commit**

```bash
git add src/map/layerStyles.ts
git commit -m "feat(bus): 都バス路線・停留所レイヤー定義を追加（minzoom 制御付き）"
```

---

### Task 4: tooltipHtml.ts に都バスツールチップ — TDD

都バス路線ホバー時の系統名ツールチップを生成する。`shortName`/`longName` をエスケープして表示（longName 空の系統にも対応）。coverage 対象（`src/map/tooltip/tooltipHtml.ts`）。

**Files:**
- Modify: `src/map/tooltip/tooltipHtml.ts`
- Modify: `src/map/tooltip/tooltipHtml.test.ts`

- [ ] **Step 1: 失敗テストを書く**

`src/map/tooltip/tooltipHtml.test.ts` を開き、既存の import 行に `buildBusRouteTooltip` を追加し、新規 `describe` ブロックを追加する:

```typescript
describe('buildBusRouteTooltip', () => {
  it('系統名（short + long）を表示する', () => {
    const html = buildBusRouteTooltip({ shortName: '上26', longName: '亀戸駅前-東京駅' })
    expect(html).toContain('上26')
    expect(html).toContain('亀戸駅前-東京駅')
  })

  it('longName 空は shortName のみを表示する', () => {
    const html = buildBusRouteTooltip({ shortName: '草43', longName: '' })
    expect(html).toContain('草43')
    expect(html).not.toMatch(/<strong>\s*<\/strong>/)
  })

  it('XSS: 不正文字をエスケープする', () => {
    const html = buildBusRouteTooltip({ shortName: '<script>', longName: '' })
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
  })

  it('両方欠損時はフォールバック表示', () => {
    const html = buildBusRouteTooltip({})
    expect(html).toContain('都営バス')
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npx vitest run src/map/tooltip/tooltipHtml.test.ts`
Expected: FAIL（`buildBusRouteTooltip is not defined` / export なし）

- [ ] **Step 3: 実装を書く**

`src/map/tooltip/tooltipHtml.ts` の末尾（`buildTransferTooltip` の後）に追加する:

```typescript
/** 都バス路線ホバー用のツールチップ HTML を生成する。shortName/longName をエスケープ。 */
export function buildBusRouteTooltip(properties: {
  shortName?: unknown
  longName?: unknown
}): string {
  const short = typeof properties.shortName === 'string' ? properties.shortName : ''
  const long = typeof properties.longName === 'string' ? properties.longName : ''
  const label = short && long ? `${short} ${long}` : short || long || '都営バス'
  return '<div class="tooltip"><strong>' + escapeHtml(label) + '</strong></div>'
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/map/tooltip/tooltipHtml.test.ts`
Expected: PASS（既存 + 追加分）

- [ ] **Step 5: Commit**

```bash
git add src/map/tooltip/tooltipHtml.ts src/map/tooltip/tooltipHtml.test.ts
git commit -m "feat(bus): 都バス路線ホバーの系統名ツールチップを追加"
```

---

### Task 5: addDataLayers.ts に addBusLayers を追加

lazy fetch 完了後に呼ぶ `addBusLayers` を追加する。鉄道レイヤー（`lines`）の下に挿入し、鉄道の視認性を優先する（設計§6）。

**Files:**
- Modify: `src/map/addDataLayers.ts`

- [ ] **Step 1: addBusLayers を追加**

`src/map/addDataLayers.ts` の import 行と末尾を以下のように変更する。

import 行（既存の `linesLayer, stationsLayer, transfersLayer` に `busRoutesLayer, busStopsLayer` と `LAYER_IDS` を追加）:
```typescript
import {
  busRoutesLayer,
  busStopsLayer,
  linesLayer,
  stationsLayer,
  transfersLayer,
  SOURCE_IDS,
  LAYER_IDS,
} from './layerStyles.ts'
```

ファイル末尾（`addDataLayers` の後）に追加:
```typescript
interface BusLayerData {
  routes: FeatureCollection
  stops: FeatureCollection
}

/**
 * 都バスの source/layer を追加する（lazy fetch 後に呼ぶ）。
 * 鉄道レイヤー（lines-layer）の下に挿入し、鉄道の視認性を優先する（設計§6）。
 * 重複追加防止は呼出側で source 存在確認を行うこと。
 */
export function addBusLayers(map: Map, data: BusLayerData): void {
  map.addSource(SOURCE_IDS.busRoutes, { type: 'geojson', data: data.routes })
  map.addSource(SOURCE_IDS.busStops, { type: 'geojson', data: data.stops })
  // beforeId = lines-layer の直前（＝下）に挿入。bus-routes → bus-stops → lines の順。
  map.addLayer(busRoutesLayer(), LAYER_IDS.lines)
  map.addLayer(busStopsLayer(), LAYER_IDS.lines)
}
```

- [ ] **Step 2: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし（`Map`, `FeatureCollection` は既存 import 済み）

- [ ] **Step 3: Commit**

```bash
git add src/map/addDataLayers.ts
git commit -m "feat(bus): 都バスレイヤー追加関数を設け鉄道より下に描画"
```

---

### Task 6: useBusLayers フック（lazy fetch 統合）

fetch トリガ（`busVisible` ＋ ズーム到達）、レイヤー追加、`visibility` 切替、hover を1つのフックにまとめる。`MapContainer` から呼ぶ。coverage 対象外（`src/map/` は `tooltipHtml.ts` のみ）だが、型チェックで担保する。

**Files:**
- Create: `src/map/useBusLayers.ts`
- Create（存在しない場合のみ）: `src/vite-env.d.ts`（`import.meta.env.BASE_URL` の型解決のため）

- [ ] **Step 1: import.meta.env の型解決を確認**

Run: `ls src/vite-env.d.ts 2>/dev/null && cat src/vite-env.d.ts`
- ファイルが存在し `/// <reference types="vite/client" />` を含む場合は何もしない。
- 存在しない場合は作成する:

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />
```

- [ ] **Step 2: useBusLayers を実装**

```typescript
// src/map/useBusLayers.ts
import { useEffect, useRef, useState } from 'react'
import type { Map, MapLayerMouseEvent } from 'maplibre-gl'
import { Popup } from 'maplibre-gl'
import { addBusLayers } from './addDataLayers.ts'
import { fetchBusData, type BusData } from '../data/bus/busData.ts'
import { LAYER_IDS, SOURCE_IDS } from './layerStyles.ts'
import { buildBusRouteTooltip } from './tooltip/tooltipHtml.ts'

/** バスデータの fetch を開始するズーム（描画 minzoom 12 の少し前で先読み）。 */
const FETCH_ZOOM = 11

interface Args {
  map: Map | null
  ready: boolean
  busVisible: boolean
}

/**
 * 都バス全系統の lazy fetch とレイヤー表示を統合するフック。
 * - busVisible && ズーム >= FETCH_ZOOM で public/data/ を1回だけ fetch（zod 検証）
 * - fetch 完了後、鉄道レイヤーの下に bus-routes/bus-stops を追加（minzoom 指定）
 * - busVisible で両レイヤーの visibility を切替
 * - bus-routes のホバーで系統名ツールチップを表示
 */
export function useBusLayers({ map, ready, busVisible }: Args): void {
  const dataRef = useRef<BusData | null>(null)
  const fetchingRef = useRef(false)
  const [busData, setBusData] = useState<BusData | null>(null)

  // fetch トリガ: busVisible && ズーム到達 && 未取得。zoom イベントで監視。
  useEffect(() => {
    if (!ready || !map || !busVisible) return
    if (dataRef.current || fetchingRef.current) return

    const load = (): void => {
      if (dataRef.current || fetchingRef.current) return
      if (map.getZoom() < FETCH_ZOOM) return
      fetchingRef.current = true
      fetchBusData(import.meta.env.BASE_URL)
        .then((data) => {
          dataRef.current = data
          setBusData(data)
        })
        .catch((error: unknown) => {
          fetchingRef.current = false
          console.error('バスデータの読み込みに失敗しました:', error)
        })
    }

    load()
    map.on('zoom', load)
    return () => {
      map.off('zoom', load)
    }
  }, [ready, map, busVisible])

  // レイヤー追加: busData 取得後1回だけ（重複防止）。lines は addDataLayers で先に追加されるため、
  // busData 到着時（fetch 完了後）には存在する。beforeId 解決のためフェイルセーフで確認。
  useEffect(() => {
    if (!ready || !map || !busData) return
    if (map.getSource(SOURCE_IDS.busRoutes)) return
    if (!map.getLayer(LAYER_IDS.lines)) return
    addBusLayers(map, busData)
  }, [ready, map, busData])

  // visibility 切替: レイヤー未追加（fetch 前）は getLayer で弾く。
  useEffect(() => {
    if (!ready || !map) return
    const visibility = busVisible ? 'visible' : 'none'
    if (map.getLayer(LAYER_IDS.busRoutes)) {
      map.setLayoutProperty(LAYER_IDS.busRoutes, 'visibility', visibility)
    }
    if (map.getLayer(LAYER_IDS.busStops)) {
      map.setLayoutProperty(LAYER_IDS.busStops, 'visibility', visibility)
    }
  }, [ready, map, busVisible])

  // ホバー（系統名ツールチップ）: レイヤー追加後1回だけ設定。
  useEffect(() => {
    if (!ready || !map || !busData) return
    if (!map.getLayer(LAYER_IDS.busRoutes)) return

    const popup = new Popup({ closeButton: false, closeOnClick: false, offset: 12 })
    const onEnter = (event: MapLayerMouseEvent): void => {
      map.getCanvas().style.cursor = 'pointer'
      const props = event.features?.[0]?.properties
      if (!props) return
      popup
        .setHTML(
          buildBusRouteTooltip(props as { shortName?: unknown; longName?: unknown }),
        )
        .setLngLat(event.lngLat)
        .addTo(map)
    }
    const onLeave = (): void => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    }
    map.on('mouseenter', LAYER_IDS.busRoutes, onEnter)
    map.on('mouseleave', LAYER_IDS.busRoutes, onLeave)
    return () => {
      map.off('mouseenter', LAYER_IDS.busRoutes, onEnter)
      map.off('mouseleave', LAYER_IDS.busRoutes, onLeave)
    }
  }, [ready, map, busData])
}
```

- [ ] **Step 3: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし（`import.meta.env.BASE_URL` が vite/client 型で解決されること）

- [ ] **Step 4: Commit**

```bash
git add src/map/useBusLayers.ts src/vite-env.d.ts
git commit -m "feat(bus): lazy fetch・レイヤー表示・hover を統合する useBusLayers を追加"
```
※ `src/vite-env.d.ts` を新規作成した場合のみ add。既存の場合は `src/map/useBusLayers.ts` のみ。

---

### Task 7: BusToggle + CSS

都バス ON/OFF トグル（`SuspensionToggle` と同パターン）。`suspension-toggle`（左上）の下に配置。

**Files:**
- Create: `src/ui/BusToggle.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: BusToggle を実装**

```typescript
// src/ui/BusToggle.tsx
interface Props {
  active: boolean
  onToggle: () => void
}

/**
 * 都バス全系統の表示 ON/OFF ボタン。
 * OFF で都バスレイヤーを隠す（鉄道中心で見たいとき用）。初期表示は ON。
 */
export function BusToggle({ active, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`bus-toggle${active ? ' active' : ''}`}
      onClick={onToggle}
      aria-pressed={active}
      title="都営バス全系統の表示を切り替えます"
    >
      🚌 都バス
    </button>
  )
}
```

- [ ] **Step 2: .bus-toggle スタイルを追加**

`src/index.css` の `.suspension-toggle.active` ブロック（204行目付近）の後に追加する:

```css
/* 都バス表示切替（地図左上オーバーレイ・運休トグルの下） */
.bus-toggle {
  position: absolute;
  top: 54px;
  left: 12px;
  z-index: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.bus-toggle:hover {
  background: #ffffff;
}
.bus-toggle.active {
  background: #00853f;
  color: #ffffff;
}
```

- [ ] **Step 3: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 4: Commit**

```bash
git add src/ui/BusToggle.tsx src/index.css
git commit -m "feat(bus): 都バス表示トグル BusToggle を追加"
```

---

### Task 8: App + MapContainer に busVisible 連動

`busVisible` 状態（デフォルト `true`・設計§7）を App に追加し、BusToggle を配置、MapContainer に渡して `useBusLayers` を駆動する。MapContainer の Props 変更と App の state 追加は不可分（片方だけだと型エラーになるため同一 Task で行う）。

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/map/MapContainer.tsx`

- [ ] **Step 1: App に busVisible 状態・BusToggle・MapContainer props を追加**

`src/App.tsx` を変更する。

import に `BusToggle` を追加（`SuspensionToggle` import の次）:
```typescript
import { BusToggle } from './ui/BusToggle.tsx'
```

`suspensionMode` の `useState` の次に `busVisible` 状態を追加:
```typescript
  // 都バス全系統の表示ON/OFF（デフォルトON）。minzoom 制御で広域時は描画されないため初期ロード影響は限定的。
  const [busVisible, setBusVisible] = useState(true)
```

`<MapContainer ...>` に `busVisible={busVisible}` を追加（`suspensionMode={suspensionMode}` の次）:
```tsx
            <MapContainer
              lines={lines}
              transfers={allTransfers}
              stationsById={stationsById}
              hiddenLineIds={hiddenLineIds}
              suspensionMode={suspensionMode}
              busVisible={busVisible}
              focusTarget={focusTarget}
              onFocusConsumed={handleFocusConsumed}
            />
```

`<SuspensionToggle ...>` の次に `<BusToggle>` を追加:
```tsx
            <SuspensionToggle
              active={suspensionMode}
              onToggle={() => setSuspensionMode((prev) => !prev)}
            />
            <BusToggle
              active={busVisible}
              onToggle={() => setBusVisible((prev) => !prev)}
            />
```

- [ ] **Step 2: MapContainer の Props に busVisible を追加し useBusLayers を呼ぶ**

`src/map/MapContainer.tsx` を変更する。

`useMapInstance` import の次に `useBusLayers` import を追加:
```typescript
import { useBusLayers } from './useBusLayers.ts'
```

`Props` interface に `busVisible: boolean` を追加（`suspensionMode: boolean` の次）。

関数の引数分割代入に `busVisible` を追加（`suspensionMode,` の次）:
```typescript
export function MapContainer({
  lines,
  transfers,
  stationsById,
  hiddenLineIds,
  suspensionMode,
  busVisible,
  focusTarget,
  onFocusConsumed,
}: Props) {
```

`useMapInstance()` / `popupRef` 宣言の後に `useBusLayers` 呼出を追加:
```typescript
  useBusLayers({ map: mapRef.current, ready, busVisible })
```
※ `mapRef` は `useMapInstance()` の戻り値（既存）。

- [ ] **Step 3: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし（App と MapContainer の両方を同時に変更するため一時的な型エラーは生じない）

- [ ] **Step 4: 手動確認**

Run: `npm run dev`
Expected: 地図タブに 🚌 都バス トグル（左上・運休トグルの下）が表示され、押下で `bus-toggle.active`（緑背景）が切替わる。ズームイン（ズーム11到達）するとバスが fetch され路線が描画される。（`Ctrl+C` で終了）

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/map/MapContainer.tsx
git commit -m "feat(bus): busVisible 状態・BusToggle・useBusLayers を組込み"
```

---

### Task 9: Legend/Header テキスト・GTFS クレジット・busVisible 連動

凡例のバス表記を新コンセプトに更新し、`busVisible` で表示連動、GTFS クレジットを追加。Header subtitle も更新。

**Files:**
- Modify: `src/ui/Legend.tsx`
- Modify: `src/App.tsx`（Legend に `busVisible` を渡す）
- Modify: `src/ui/Header.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Legend に busVisible 連動・テキスト・クレジットを追加**

`src/ui/Legend.tsx` を以下に差し替える:

```typescript
import type { Line } from '../domain/types.ts'

interface Props {
  lines: readonly Line[]
  hiddenLineIds: ReadonlySet<string>
  onToggleLine: (lineId: string) => void
  busVisible: boolean
}

/**
 * 凡例。各路線をトグルボタンとして表示ON/OFFを切り替える。
 * 非表示路線は半透明＋打ち消し線で状態を示す。
 * 都バスは busVisible で表示/非表示を反映し、データ元クレジットを併記する。
 */
export function Legend({ lines, hiddenLineIds, onToggleLine, busVisible }: Props) {
  return (
    <aside className="legend" aria-label="凡例">
      <h2 className="legend-title">路線（タップで表示切替）</h2>
      <ul className="legend-lines">
        {lines.map((line) => {
          const hidden = hiddenLineIds.has(line.id)
          return (
            <li key={line.id} className="legend-line">
              <button
                type="button"
                className={`legend-toggle${hidden ? ' is-hidden' : ''}`}
                onClick={() => onToggleLine(line.id)}
                aria-pressed={!hidden}
                aria-label={`${line.name}を${hidden ? '表示' : '非表示'}`}
              >
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: line.color }}
                  aria-hidden="true"
                />
                <span className="legend-name">{line.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="legend-transfer">
        <span className="legend-dashed" aria-hidden="true" />
        <span>非公式乗換（徒歩連絡）</span>
      </p>
      <p className={`legend-bus${busVisible ? '' : ' is-hidden'}`}>
        <span className="legend-thin-solid" aria-hidden="true" />
        <span>都営バス全系統</span>
      </p>
      <p className="legend-source">
        バスデータ: 公共交通オープンデータセンター（都営バス GTFS-JP）
      </p>
    </aside>
  )
}
```

- [ ] **Step 2: App から Legend に busVisible を渡す**

`src/App.tsx` の `<Legend ...>` に `busVisible={busVisible}` を追加（Task 8 で作成した state）:
```tsx
            <Legend
              lines={lines}
              hiddenLineIds={hiddenLineIds}
              onToggleLine={toggleLine}
              busVisible={busVisible}
            />
```

- [ ] **Step 3: legend-source / legend-bus.is-hidden のスタイルを追加**

`src/index.css` の `.legend-thin-solid` ブロック（137行目付近）の後に追加する:
```css
.legend-bus.is-hidden {
  opacity: 0.4;
}
.legend-source {
  margin: 6px 0 0;
  padding-top: 6px;
  border-top: 1px solid #eeeeee;
  color: #888888;
  font-size: 11px;
}
```

- [ ] **Step 4: Header subtitle を更新**

`src/ui/Header.tsx` の subtitle を新コンセプトに変更:

```typescript
export function Header() {
  return (
    <header className="header">
      <h1 className="header-title">東京 非公式乗換マップ</h1>
      <p className="header-subtitle">
        徒歩連絡の非公式乗換と、鉄道路線＋都営バス全系統を表示
      </p>
    </header>
  )
}
```

- [ ] **Step 5: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 6: 手動確認**

Run: `npm run dev`
Expected: 凡例のバス項目が「都営バス全系統」に変わり、データ元クレジットが表示される。🚌 都バストグル OFF で凡例のバス項目が半透明になる。（`Ctrl+C` で終了）

- [ ] **Step 7: Commit**

```bash
git add src/ui/Legend.tsx src/App.tsx src/ui/Header.tsx src/index.css
git commit -m "feat(bus): 凡例・ヘッダーを全系統プロットに更新しGTFSクレジットを追加"
```

---

### Task 10: 草43廃止（GTFS 全系統へ一本化）

手定義の草43（`kusa43Line`）と、それが参照する徒歩乗換 transfer 2件を削除する。GTFS 全系統に一本化し、`stationsById` 拡張の複雑さを回避する（ユーザー合意）。

**Files:**
- Delete: `src/data/lines/kusa43Line.ts`
- Modify: `src/data/index.ts`
- Modify: `src/data/transfers.ts`
- Modify: `src/data/index.test.ts`

- [ ] **Step 1: kusa43Line.ts を削除**

Run: `git rm src/data/lines/kusa43Line.ts`

- [ ] **Step 2: src/data/index.ts から kusa43Line を除去**

`import { kusa43Line } from './lines/kusa43Line.ts'`（26行目）を削除。
`validatedLines` の配列末尾の `kusa43Line,`（54行目）を削除。

- [ ] **Step 3: src/data/transfers.ts から草43乗換2件を削除**

`// === バス路線と鉄道駅の徒歩連絡...` コメント（186行目）から配列末尾の `bus-kusa43-kitasenju` ブロック終了（200行目）までを削除。配列の最後は `detour-jy28-mita` のブロック（`},`）のあと、閉じ `]` になるよう調整する。

削除対象ブロック（186〜200行目）:
```typescript
  // === バス路線と鉄道駅の徒歩連絡（鉄道網の隙間をバスで埋める） ===
  {
    id: 'bus-kusa43-asakusa',
    fromStationId: 'g19',
    toStationId: 'k43-01',
    walkMinutes: 5,
    note: '浅草雷門（都営バス草43）への徒歩連絡',
  },
  {
    id: 'bus-kusa43-kitasenju',
    fromStationId: 'h22',
    toStationId: 'k43-09',
    walkMinutes: 10,
    note: '千住大橋（都営バス草43）への徒歩連絡',
  },
```

- [ ] **Step 4: index.test.ts の路線数を 24→23 に更新**

`src/data/index.test.ts` の11行目:
```typescript
  it('23路線が定義されている', () => {
    expect(lines.length).toBe(23)
  })
```

- [ ] **Step 5: テスト・型チェック**

Run: `npm run test:run && npm run typecheck`
Expected: 全テスト PASS（`index.test.ts` の from/to 解決テストは残る transfer が全て鉄道駅参照のため PASS。路線数 23 で PASS）。型エラーなし。

- [ ] **Step 6: Commit**

```bash
git add -A src/data/lines/kusa43Line.ts src/data/index.ts src/data/transfers.ts src/data/index.test.ts
git commit -m "refactor(bus): 手定義の草43を廃止し GTFS 全系統へ一本化"
```
※ `git add -A` で削除（kusa43Line.ts）と変更をまとめてステージ。

---

### Task 11: README・GTFS クレジット更新

コンセプト・バス編集ルール・mode 表を全系統プロットに更新し、GTFS データ元クレジットを追加する。

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 冒頭コンセプト（3行目）を更新**

```markdown
東京の鉄道路線図と、徒歩・バス連絡による「非公式乗換」に加え、都営バス全系統をインタラクティブに可視化する Web アプリケーション。[MapLibre GL JS](https://maplibre.org/) で地図上に鉄道路線（太い実線）・都営バス全系統（細い実線）・徒歩の非公式乗換（点線）を描き、ホバーで駅名や徒歩時間・系統名を表示します。都営バスは公共交通オープンデータの GTFS-JP から全系統を取り込み、道路上の正確な経路で描画します（ズームインすると表示・🚌 都バストグルで切替）。
```

- [ ] **Step 2: 特徴のバス行（9行目）を更新**

```markdown
- **都営バス全系統のプロット**: GTFS-JP から取り込んだ全系統を道路上の正確な経路で描画（lazy fetch・ズーム/トグル制御付き）
```

- [ ] **Step 3: バス編集ルール（82-90行目「バス路線の追加（編集ルール）」）を差し替え**

該当見出し以下（「バス路線は『鉄道で直接繋がらない2点…』から停留所間隔の項目まで）を以下に差し替え:

```markdown
#### バス路線（都営バス全系統）

都営バスは手定義せず、GTFS-JP オープンデータから全系統を一括取り込みします。

1. GTFS-JP zip を用意し `npm run build:bus -- <path-to-gtfs.zip>` を実行すると、`public/data/bus-routes.json` / `bus-stops.json` が再生成されます（データ元はスクリプト冒頭コメントに明記）。
2. 成果物はリポジトリにコミットします（元 zip は `.gitignore` で除外）。
3. アプリはズーム到達または🚌 都バストグル ON で lazy fetch して描画します（約4MB ため初期ロードには含めません）。
4. 編集ルール（手定義バス）は廃止しました。バスは GTFS 由来のみです。
```

- [ ] **Step 4: mode 表（76-80行目）の bus 行を更新**

```markdown
| `bus` | 都営バス（GTFS 全系統） | 細い半透明の実線（路線色） |
```

- [ ] **Step 5: ライセンス・帰属（152-154行目）に GTFS クレジットを追加**

```markdown
## ライセンス・帰属

地図タイル: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

バスデータ（都営バス全系統）: [公共交通オープンデータセンター](https://www.odpt.org/) / [東京都オープンデータカタログ](https://catalog.data.metro.tokyo.lg.jp/dataset/t000018d0000000052) の都営バス GTFS-JP（アプリ画面の凡例にもクレジットを記載）
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs(bus): README を全系統プロットに更新し GTFS クレジットを追加"
```

---

### Task 12: 全体確認（型・テスト・カバレッジ・lint・build）

**Files:**（変更なし、検証のみ）

- [ ] **Step 1: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 2: テスト全実行**

Run: `npm run test:run`
Expected: 全テスト PASS

- [ ] **Step 3: カバレッジ（80% 閾値維持）**

Run: `npm run test:coverage`
Expected: 全テスト PASS。`src/domain/**`/`src/geojson/**`/`src/data/**`（`busData.ts` 含む）/`src/map/tooltip/tooltipHtml.ts` が lines/functions/branches/statements とも 80% 以上。

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: エラーなし（`.ts/.tsx` は ESLint 対象外、`.js` 系のみ）

- [ ] **Step 5: 本番ビルド**

Run: `npm run build`
Expected: ビルド成功。`dist/` 生成。`public/data/bus-*.json` は `dist/data/` にコピーされる（`public/` 配信の確認）。

- [ ] **Step 6: 手動動作確認**

Run: `npm run preview`（または `npm run dev`）
Expected:
- 初期ロードは鉄道のみ（バスは描画されない＝4MB 未 fetch）
- 🚌 都バストグル（左上・緑）が ON の状態でズームイン（ズーム11到達）するとバスが fetch され、ズーム12〜で路線・14〜で停留所が描画される
- バス路線ホバーで系統名（例「上26 亀戸駅前-東京駅」）がツールチップ表示
- 🚌 都バストグル OFF でバスレイヤーが非表示
- 凡例のバス項目がトグルに連動して半透明化
- 草43が GTFS 由来で描画され、手定義の重複がない
（`Ctrl+C` で終了）

- [ ] **Step 7: 失敗時は該当 Task に戻って修正（本 Task ではコミットしない）**

全 Step が PASS すれば Plan 2 完了。

---

## Plan 2 完了条件

- [ ] バス GeoJSON が `public/data/` から lazy fetch され、`FeatureCollectionSchema` で検証される
- [ ] 都バス路線（minzoom 12）・停留所（minzoom 14）が鉄道レイヤーの下に描画される
- [ ] 🚌 都バストグル（デフォルト ON）とズーム到達で表示が制御される
- [ ] バス路線ホバーで系統名ツールチップ（XSS エスケープ済み）が表示される
- [ ] 手定義の草43（`kusa43Line`・transfer 2件）が削除され、GTFS 全系統に一本化されている
- [ ] README・画面凡例に GTFS クレジットが記載されている
- [ ] `npm run typecheck` / `test:run` / `test:coverage`（80%+）/ `lint` / `build` がすべて PASS
- [ ] 初期ロードにバスデータ（約4MB）が含まれない（lazy fetch 確認）

## 設計との差分（完了時の記録用）

- ロード方式: import → lazy fetch（規模実測による）
- 草43乗換: GTFS ID 更新 → 削除（全系統プロットで自明なため・ユーザー合意）
- 設計§8 の「stationsById 拡張」は不要（transfer 削除により）
