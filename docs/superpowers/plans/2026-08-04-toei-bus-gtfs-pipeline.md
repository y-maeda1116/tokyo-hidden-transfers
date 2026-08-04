# 都バス全系統プロット — Plan 1: GTFS→GeoJSON 変換パイプライン 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 都営バス GTFS-JP を読み込み、道路上の正確な経路（shapes.txt）と停留所（stops.txt）から GeoJSON を生成し、リポジトリにコミットしてアプリから import 可能にする。

**Architecture:** 変換ロジックはテスト・型チェック対象の純粋関数として `src/data/bus/gtfs/` に置く（`vite.config.ts` の `test.include=['src/**/*.test.ts']`・`tsconfig.include=['src']` の制約対応）。エントリポイント（ファイルI/Oのみ）は `scripts/build-bus-geojson.ts` とし、tsconfig に追加する。shapes は Douglas-Peucker で簡略化、routes.txt の route_color を系統色に使用（未設定時は既定色フォールバック）。成果物は `.json` 拡張子で `resolveJsonModule` により import 可能にする。

**Tech Stack:** TypeScript 7 / vitest / zod / csv-parse / unzipper / tsx

**設計との差分（制約対応）:**
- 純粋関数の配置: 設計の `scripts/gtfs/*.ts` → `src/data/bus/gtfs/*.ts`（テスト・型チェック対象にするため）
- 成果物拡張子: 設計の `*.geojson` → `*.json`（`resolveJsonModule` で確実に import するため）
- Plan 2（アプリ統合）は別計画。本 Plan 1 完了・実データ規模実測後に作成する。

---

## File Structure

**Create:**
- `src/data/bus/gtfs/types.ts` — GTFS レコードの型（GtfsRoute/GtfsTrip/GtfsShapePoint/GtfsStop）
- `src/data/bus/gtfs/simplifyShape.ts` + `.test.ts` — Douglas-Peucker 簡略化（純粋関数）
- `src/data/bus/gtfs/parseCsv.ts` + `.test.ts` — CSV→Records（純粋関数）
- `src/data/bus/gtfs/parseGtfsRecords.ts` + `.test.ts` — Records→型付きGTFS（純粋関数、バリデーション）
- `src/data/bus/gtfs/buildBusFeatures.ts` + `.test.ts` — GTFS→FeatureCollection（純粋関数）
- `src/data/bus/gtfs/parseGtfsZip.ts` + `.test.ts` — Buffer→GTFSレコード（zip解凍統合）
- `src/data/bus/gtfs/fixtures/mini-toei.zip` — 統合テスト用の小 GTFS（手作り）
- `scripts/build-bus-geojson.ts` — エントリポイント（ファイルI/O のみ）
- `src/data/bus/bus-routes.json` — 生成成果物（コミット）
- `src/data/bus/bus-stops.json` — 生成成果物（コミット）
- `src/data/bus/index.ts` — GeoJSON import + FeatureCollectionSchema 検証

**Modify:**
- `tsconfig.json` — `include` に `"scripts"` 追加
- `package.json` — `build:bus` スクリプト追加、devDependencies 追加

---

### Task 1: GTFS 型定義

**Files:**
- Create: `src/data/bus/gtfs/types.ts`

- [ ] **Step 1: 型ファイルを作成**

```typescript
// src/data/bus/gtfs/types.ts

/** GTFS routes.txt の1行（本アプリが使うフィールドのみ）。route_color は省略可。 */
export interface GtfsRoute {
  readonly routeId: string
  readonly shortName: string
  readonly longName: string
  /** #RRGGBB。未設定/不正時は undefined（呼び出し側で既定色へフォールバック）。 */
  readonly color?: string
}

/** GTFS trips.txt の1行。shape_id で route と経路形状を結ぶ。 */
export interface GtfsTrip {
  readonly tripId: string
  readonly routeId: string
  readonly shapeId?: string
}

/** GTFS shapes.txt の1点。shape_pt_sequence 順に並べて経路を構成する。 */
export interface GtfsShapePoint {
  readonly shapeId: string
  readonly lat: number
  readonly lon: number
  readonly sequence: number
}

/** GTFS stops.txt の1行。 */
export interface GtfsStop {
  readonly stopId: string
  readonly name: string
  readonly lat: number
  readonly lon: number
}

/** 変換対象の GTFS レコード群。parseGtfsZip が生成し、buildBusFeatures が消費する。 */
export interface GtfsRecords {
  readonly routes: readonly GtfsRoute[]
  readonly trips: readonly GtfsTrip[]
  readonly shapes: readonly GtfsShapePoint[]
  readonly stops: readonly GtfsStop[]
}
```

- [ ] **Step 2: 型チェックでエラーがないことを確認**

Run: `npm run typecheck`
Expected: エラーなし（既存と同じく PASS）

- [ ] **Step 3: Commit**

```bash
git add src/data/bus/gtfs/types.ts
git commit -m "feat(bus): GTFS レコードの型を定義"
```

---

### Task 2: simplifyShape（Douglas-Peucker 簡略化）— TDD

**Files:**
- Create: `src/data/bus/gtfs/simplifyShape.ts`
- Test: `src/data/bus/gtfs/simplifyShape.test.ts`

- [ ] **Step 1: 失敗テストを書く**

```typescript
// src/data/bus/gtfs/simplifyShape.test.ts
import { describe, expect, it } from 'vitest'
import { simplifyShape } from './simplifyShape.ts'

describe('simplifyShape', () => {
  it('2点以下はそのまま返す', () => {
    expect(simplifyShape([[0, 0], [1, 1]], 0.01)).toEqual([[0, 0], [1, 1]])
    expect(simplifyShape([[0, 0]], 0.01)).toEqual([[0, 0]])
  })

  it('一直線上の中間点を許容誤差内で除去する', () => {
    // (0,0)-(1,0)-(2,0)-(3,0) は直線。中間点は直線上なので除去される。
    const line = [[0, 0], [1, 0], [2, 0], [3, 0]] as [number, number][]
    const got = simplifyShape(line, 0.01)
    expect(got).toEqual([[0, 0], [3, 0]])
  })

  it('直線から外れた点は保持する', () => {
    // (0,0)-(1,1)-(2,0): 中間点(1,1)は直線(0,0)-(2,0)から大きく外れる。
    const v = [[0, 0], [1, 1], [2, 0]] as [number, number][]
    expect(simplifyShape(v, 0.01)).toEqual([[0, 0], [1, 1], [2, 0]])
  })

  it('始点と終点は常に保持する', () => {
    const pts = [[0, 0], [0.0001, 0.0001], [1, 1]] as [number, number][]
    const got = simplifyShape(pts, 0.01)
    expect(got[0]).toEqual([0, 0])
    expect(got[got.length - 1]).toEqual([1, 1])
  })

  it('tolerance=0 は全点を保持する', () => {
    const pts = [[0, 0], [1, 0.001], [2, 0]] as [number, number][]
    expect(simplifyShape(pts, 0)).toHaveLength(3)
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npx vitest run src/data/bus/gtfs/simplifyShape.test.ts`
Expected: FAIL（`simplifyShape is not defined` / モジュールなし）

- [ ] **Step 3: 実装を書く**

```typescript
// src/data/bus/gtfs/simplifyShape.ts

/**
 * Douglas-Peucker 法で経路（[lon, lat] の列）を簡略化する（純粋関数）。
 * 始点・終点は常に保持し、直線からの垂直距離が tolerance 未満の点を再帰的に除去する。
 * 座標は平面近似（簡略化用途で十分）。tolerance は度単位（0.00005 度 ≒ 5.5m）。
 */
export function simplifyShape(
  points: readonly [number, number][],
  tolerance: number,
): [number, number][] {
  if (points.length <= 2) return points.map((p) => [p[0], p[1]])

  const start = points[0]
  const end = points[points.length - 1]

  // 始点・終点から最も離れた点を探す
  let maxDist = 0
  let maxIndex = 0
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end)
    if (d > maxDist) {
      maxDist = d
      maxIndex = i
    }
  }

  if (maxDist <= tolerance) {
    return [start, end].map((p) => [p[0], p[1]])
  }

  // 最大距離の点で分割して再帰
  const left = simplifyShape(points.slice(0, maxIndex + 1), tolerance)
  const right = simplifyShape(points.slice(maxIndex), tolerance)
  // 左側の末尾と右側の先頭は同じ点なので重複を除く
  return [...left, ...right.slice(1)]
}

/** 点 p から直線 (a-b) への垂直距離（平面近似）。 */
function perpendicularDistance(
  p: [number, number],
  a: [number, number],
  b: [number, number],
): number {
  const [x, y] = p
  const [x1, y1] = a
  const [x2, y2] = b
  // a == b の場合は p と a の距離
  if (x1 === x2 && y1 === y2) {
    return Math.hypot(x - x1, y - y1)
  }
  // 点と直線の距離公式
  const num = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1)
  const den = Math.hypot(y2 - y1, x2 - x1)
  return num / den
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/data/bus/gtfs/simplifyShape.test.ts`
Expected: PASS（5/5）

- [ ] **Step 5: Commit**

```bash
git add src/data/bus/gtfs/simplifyShape.ts src/data/bus/gtfs/simplifyShape.test.ts
git commit -m "feat(bus): Douglas-Peucker による経路簡略化を追加"
```

---

### Task 3: parseCsv（CSV→Records）— TDD

**Files:**
- Create: `src/data/bus/gtfs/parseCsv.ts`
- Test: `src/data/bus/gtfs/parseCsv.test.ts`
- Modify: `package.json`（devDependencies に `csv-parse` 追加）

- [ ] **Step 1: csv-parse を devDependency に追加**

Run: `npm install -D csv-parse@^5`
Expected: `package.json`/`package-lock.json` に `csv-parse` 追加。`npm audit` で高危険度なしを確認。

- [ ] **Step 2: 失敗テストを書く**

```typescript
// src/data/bus/gtfs/parseCsv.test.ts
import { describe, expect, it } from 'vitest'
import { parseCsv } from './parseCsv.ts'

describe('parseCsv', () => {
  it('ヘッダーと行をレコードに変換する', () => {
    const csv = 'route_id,route_short_name\nR1,上26\nR2,草43'
    expect(parseCsv(csv)).toEqual([
      { route_id: 'R1', route_short_name: '上26' },
      { route_id: 'R2', route_short_name: '草43' },
    ])
  })

  it('引用符で囲まれたカンマを扱う', () => {
    const csv = 'id,name\n1,"亀戸,駅前"'
    expect(parseCsv(csv)).toEqual([{ id: '1', name: '亀戸,駅前' }])
  })

  it('空のテキストは空配列を返す', () => {
    expect(parseCsv('')).toEqual([])
  })

  it('空行をスキップする', () => {
    const csv = 'a,b\n1,2\n\n'
    expect(parseCsv(csv)).toEqual([{ a: '1', b: '2' }])
  })
})
```

- [ ] **Step 3: テストを実行して失敗を確認**

Run: `npx vitest run src/data/bus/gtfs/parseCsv.test.ts`
Expected: FAIL（`parseCsv is not defined`）

- [ ] **Step 4: 実装を書く**

```typescript
// src/data/bus/gtfs/parseCsv.ts
import { parse } from 'csv-parse/sync'

/**
 * CSV テキストをレコードの配列に変換する（純粋関数）。
 * 先頭行をヘッダーとみなし、各列をキーとしたレコードを生成する。
 * 引用符・空行を適切に処理する（csv-parse/sync に委譲）。
 */
export function parseCsv(csvText: string): ReadonlyArray<Record<string, string>> {
  if (csvText.trim() === '') return []
  return parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  })
}
```

- [ ] **Step 5: テストを実行して成功を確認**

Run: `npx vitest run src/data/bus/gtfs/parseCsv.test.ts`
Expected: PASS（4/4）

- [ ] **Step 6: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 7: Commit**

```bash
git add src/data/bus/gtfs/parseCsv.ts src/data/bus/gtfs/parseCsv.test.ts package.json package-lock.json
git commit -m "feat(bus): CSV→Records パースを追加"
```

---

### Task 4: parseGtfsRecords（Records→型付きGTFS）— TDD

**Files:**
- Create: `src/data/bus/gtfs/parseGtfsRecords.ts`
- Test: `src/data/bus/gtfs/parseGtfsRecords.test.ts`

- [ ] **Step 1: 失敗テストを書く**

```typescript
// src/data/bus/gtfs/parseGtfsRecords.test.ts
import { describe, expect, it } from 'vitest'
import {
  parseRoutes,
  parseTrips,
  parseShapes,
  parseStops,
} from './parseGtfsRecords.ts'

describe('parseGtfsRecords', () => {
  it('routes を変換する（color 正常）', () => {
    const got = parseRoutes([
      { route_id: 'R1', route_short_name: '上26', route_long_name: '亀戸駅前-東京駅', route_color: '7AC46B' },
    ])
    expect(got).toEqual([
      { routeId: 'R1', shortName: '上26', longName: '亀戸駅前-東京駅', color: '#7AC46B' },
    ])
  })

  it('route_color 不正/未設定は color を undefined にする', () => {
    expect(parseRoutes([{ route_id: 'R1', route_short_name: 'S', route_long_name: 'L' }])[0].color).toBeUndefined()
    expect(parseRoutes([{ route_id: 'R1', route_short_name: 'S', route_long_name: 'L', route_color: 'xyz' }])[0].color).toBeUndefined()
  })

  it('route_id 欠損はスキップする（警告対象）', () => {
    expect(parseRoutes([{ route_short_name: 'S', route_long_name: 'L' }])).toEqual([])
  })

  it('trips を変換する', () => {
    expect(parseTrips([{ trip_id: 'T1', route_id: 'R1', shape_id: 'SH1' }])).toEqual([
      { tripId: 'T1', routeId: 'R1', shapeId: 'SH1' },
    ])
  })

  it('shape_id 無しの trip は shapeId undefined', () => {
    expect(parseTrips([{ trip_id: 'T1', route_id: 'R1' }])).toEqual([
      { tripId: 'T1', routeId: 'R1', shapeId: undefined },
    ])
  })

  it('shapes を sequence 順に変換する', () => {
    const got = parseShapes([
      { shape_id: 'SH1', shape_pt_lat: '35.7', shape_pt_lon: '139.8', shape_pt_sequence: '2' },
      { shape_id: 'SH1', shape_pt_lat: '35.6', shape_pt_lon: '139.7', shape_pt_sequence: '1' },
    ])
    expect(got.map((s) => s.sequence)).toEqual([1, 2])
    expect(got[0]).toMatchObject({ lat: 35.6, lon: 139.7 })
  })

  it('stops を変換する', () => {
    expect(parseStops([{ stop_id: 'S1', stop_name: '浅草雷門', stop_lat: '35.71', stop_lon: '139.79' }])).toEqual([
      { stopId: 'S1', name: '浅草雷門', lat: 35.71, lon: 139.79 },
    ])
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npx vitest run src/data/bus/gtfs/parseGtfsRecords.test.ts`
Expected: FAIL（関数未定義）

- [ ] **Step 3: 実装を書く**

```typescript
// src/data/bus/gtfs/parseGtfsRecords.ts
import type { GtfsRoute, GtfsShapePoint, GtfsStop, GtfsTrip } from './types.ts'

const COLOR_RE = /^#[0-9a-fA-F]{6}$/

/** GTFS の route_color（#無し6桁想定）を #RRGGBB に正規化。不正なら undefined。 */
function normalizeColor(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const hex = raw.startsWith('#') ? raw : `#${raw}`
  return COLOR_RE.test(hex) ? hex.toUpperCase() : undefined
}

function toNumber(value: string | undefined, fallback = NaN): number {
  if (value === undefined || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/** routes.txt のレコードを GtfsRoute に変換。必須キー欠損行はスキップ。 */
export function parseRoutes(
  rows: readonly Record<string, string>[],
): GtfsRoute[] {
  return rows
    .map((row) => {
      const routeId = row.route_id
      const shortName = row.route_short_name
      const longName = row.route_long_name
      if (!routeId || !shortName || !longName) return null
      return {
        routeId,
        shortName,
        longName,
        color: normalizeColor(row.route_color),
      }
    })
    .filter((r): r is GtfsRoute => r !== null)
}

/** trips.txt のレコードを GtfsTrip に変換。trip_id/route_id 欠損はスキップ。 */
export function parseTrips(
  rows: readonly Record<string, string>[],
): GtfsTrip[] {
  return rows
    .map((row) => {
      const tripId = row.trip_id
      const routeId = row.route_id
      if (!tripId || !routeId) return null
      const shapeId = row.shape_id
      return { tripId, routeId, shapeId: shapeId || undefined }
    })
    .filter((t): t is GtfsTrip => t !== null)
}

/** shapes.txt のレコードを GtfsShapePoint に変換し sequence 昇順にソート。 */
export function parseShapes(
  rows: readonly Record<string, string>[],
): GtfsShapePoint[] {
  const points = rows
    .map((row) => {
      const shapeId = row.shape_id
      if (!shapeId) return null
      const lat = toNumber(row.shape_pt_lat)
      const lon = toNumber(row.shape_pt_lon)
      const sequence = toNumber(row.shape_pt_sequence, 0)
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
      return { shapeId, lat, lon, sequence }
    })
    .filter((p): p is GtfsShapePoint => p !== null)
  return points.slice().sort((a, b) => a.sequence - b.sequence)
}

/** stops.txt のレコードを GtfsStop に変換。必須キー欠損はスキップ。 */
export function parseStops(
  rows: readonly Record<string, string>[],
): GtfsStop[] {
  return rows
    .map((row) => {
      const stopId = row.stop_id
      const name = row.stop_name
      if (!stopId || !name) return null
      const lat = toNumber(row.stop_lat)
      const lon = toNumber(row.stop_lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
      return { stopId, name, lat, lon }
    })
    .filter((s): s is GtfsStop => s !== null)
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/data/bus/gtfs/parseGtfsRecords.test.ts`
Expected: PASS（全件）

- [ ] **Step 5: Commit**

```bash
git add src/data/bus/gtfs/parseGtfsRecords.ts src/data/bus/gtfs/parseGtfsRecords.test.ts
git commit -m "feat(bus): GTFS レコードの型付き変換とバリデーションを追加"
```

---

### Task 5: buildBusFeatures（GTFS→FeatureCollection）— TDD

**Files:**
- Create: `src/data/bus/gtfs/buildBusFeatures.ts`
- Test: `src/data/bus/gtfs/buildBusFeatures.test.ts`

- [ ] **Step 1: 失敗テストを書く**

```typescript
// src/data/bus/gtfs/buildBusFeatures.test.ts
import { describe, expect, it } from 'vitest'
import { buildBusFeatures } from './buildBusFeatures.ts'
import type { GtfsRecords } from './types.ts'

const baseRecords: GtfsRecords = {
  routes: [
    { routeId: 'R1', shortName: '上26', longName: '亀戸-東京', color: '#7AC46B' },
    { routeId: 'R2', shortName: '草43', longName: '浅草-千住', color: undefined },
  ],
  trips: [
    { tripId: 'T1', routeId: 'R1', shapeId: 'SH1' },
    { tripId: 'T2', routeId: 'R2', shapeId: 'SH2' },
  ],
  shapes: [
    { shapeId: 'SH1', lat: 35.70, lon: 139.80, sequence: 1 },
    { shapeId: 'SH1', lat: 35.71, lon: 139.81, sequence: 2 },
    { shapeId: 'SH1', lat: 35.72, lon: 139.82, sequence: 3 },
    { shapeId: 'SH2', lat: 35.71, lon: 139.79, sequence: 1 },
    { shapeId: 'SH2', lat: 35.74, lon: 139.80, sequence: 2 },
  ],
  stops: [
    { stopId: 'S1', name: '浅草雷門', lat: 35.7115, lon: 139.7950 },
  ],
}

describe('buildBusFeatures', () => {
  it('shape を LineString に変換し route 情報を付与する', () => {
    const { routes } = buildBusFeatures(baseRecords, { tolerance: 0 })
    const r1 = routes.features.find((f) => f.properties?.routeId === 'R1')
    expect(r1?.geometry).toEqual({ type: 'LineString', coordinates: [[139.80, 35.70], [139.81, 35.71], [139.82, 35.72]] })
    expect(r1?.properties).toMatchObject({ kind: 'bus-route', shortName: '上26', longName: '亀戸-東京', color: '#7AC46B' })
  })

  it('route_color 未設定時は既定色 #00853f でフォールバックする', () => {
    const { routes } = buildBusFeatures(baseRecords, { tolerance: 0 })
    const r2 = routes.features.find((f) => f.properties?.routeId === 'R2')
    expect(r2?.properties?.color).toBe('#00853f')
  })

  it('停留所を Point Feature に変換する', () => {
    const { stops } = buildBusFeatures(baseRecords, { tolerance: 0 })
    expect(stops.features[0].geometry).toEqual({ type: 'Point', coordinates: [139.7950, 35.7115] })
    expect(stops.features[0].properties).toMatchObject({ kind: 'bus-stop', name: '浅草雷門' })
  })

  it('同一 shape_id は重複して出力しない', () => {
    const dup: GtfsRecords = {
      ...baseRecords,
      trips: [
        { tripId: 'T1', routeId: 'R1', shapeId: 'SH1' },
        { tripId: 'T1b', routeId: 'R1', shapeId: 'SH1' },
      ],
    }
    const { routes } = buildBusFeatures(dup, { tolerance: 0 })
    expect(routes.features.filter((f) => f.properties?.routeId === 'R1')).toHaveLength(1)
  })

  it('route に属さない shape は除外される', () => {
    const orphan: GtfsRecords = {
      ...baseRecords,
      shapes: [...baseRecords.shapes, { shapeId: 'SH9', lat: 35.0, lon: 139.0, sequence: 1 }, { shapeId: 'SH9', lat: 35.1, lon: 139.1, sequence: 2 }],
    }
    const { routes } = buildBusFeatures(orphan, { tolerance: 0 })
    expect(routes.features.find((f) => f.properties?.routeId === undefined)).toBeUndefined()
  })

  it('FeatureCollection の型が正しい', () => {
    const { routes, stops } = buildBusFeatures(baseRecords, { tolerance: 0 })
    expect(routes.type).toBe('FeatureCollection')
    expect(stops.type).toBe('FeatureCollection')
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npx vitest run src/data/bus/gtfs/buildBusFeatures.test.ts`
Expected: FAIL（関数未定義）

- [ ] **Step 3: 実装を書く**

```typescript
// src/data/bus/gtfs/buildBusFeatures.ts
import type { FeatureCollection } from 'geojson'
import type { GtfsRecords } from './types.ts'
import { simplifyShape } from './simplifyShape.ts'

/** 都バス標準色（route_color 未設定時のフォールバック）。 */
export const DEFAULT_BUS_COLOR = '#00853F'

export interface BuildBusFeaturesOptions {
  /** 簡略化の許容誤差（度単位）。0 で簡略化なし。 */
  readonly tolerance: number
}

export interface BusFeatures {
  readonly routes: FeatureCollection
  readonly stops: FeatureCollection
}

/**
 * GTFS レコードから路線（LineString）と停留所（Point）の FeatureCollection を構築する（純粋関数）。
 * - trips 経由で shape_id → route_id を解決（route に属さない shape は除外）
 * - 同一 shape_id は1本に重複排除
 * - shapes は tolerance で簡略化
 * - route_color 未設定/不正は既定色へフォールバック
 */
export function buildBusFeatures(
  records: GtfsRecords,
  options: BuildBusFeaturesOptions,
): BusFeatures {
  const { routes, trips, shapes, stops } = records
  const { tolerance } = options

  const routeById = new Map(routes.map((r) => [r.routeId, r]))
  // shape_id -> route_id（最初に出現した対応で代表）
  const shapeToRoute = new Map<string, string>()
  for (const trip of trips) {
    if (trip.shapeId && !shapeToRoute.has(trip.shapeId)) {
      shapeToRoute.set(trip.shapeId, trip.routeId)
    }
  }

  // shape_id -> 座標列（sequence 順は parseShapes で保証済み）
  const coordsByShape = new Map<string, [number, number][]>()
  for (const pt of shapes) {
    const list = coordsByShape.get(pt.shapeId) ?? []
    list.push([pt.lon, pt.lat])
    coordsByShape.set(pt.shapeId, list)
  }

  const routeFeatures = [...coordsByShape.entries()]
    .map(([shapeId, coords]) => {
      const routeId = shapeToRoute.get(shapeId)
      if (!routeId) return null
      const route = routeById.get(routeId)
      if (!route) return null
      const simplified = simplifyShape(coords, tolerance)
      if (simplified.length < 2) return null
      return {
        type: 'Feature' as const,
        geometry: { type: 'LineString' as const, coordinates: simplified },
        properties: {
          kind: 'bus-route',
          routeId: route.routeId,
          shapeId,
          shortName: route.shortName,
          longName: route.longName,
          color: route.color ?? DEFAULT_BUS_COLOR,
        },
      }
    })
    .filter((f): f is NonNullable<typeof f> => f !== null)

  const stopFeatures = stops.map((stop) => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [stop.lon, stop.lat] as [number, number] },
    properties: {
      kind: 'bus-stop',
      stopId: stop.stopId,
      name: stop.name,
    },
  }))

  return {
    routes: { type: 'FeatureCollection', features: routeFeatures },
    stops: { type: 'FeatureCollection', features: stopFeatures },
  }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/data/bus/gtfs/buildBusFeatures.test.ts`
Expected: PASS（全件）

- [ ] **Step 5: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 6: Commit**

```bash
git add src/data/bus/gtfs/buildBusFeatures.ts src/data/bus/gtfs/buildBusFeatures.test.ts
git commit -m "feat(bus): GTFS から路線・停留所 FeatureCollection を構築"
```

---

### Task 6: parseGtfsZip（Buffer→GTFSレコード統合）— TDD

**Files:**
- Create: `src/data/bus/gtfs/parseGtfsZip.ts`
- Test: `src/data/bus/gtfs/parseGtfsZip.test.ts`
- Create: `src/data/bus/gtfs/fixtures/mini-toei.zip`（手作り、後述）
- Modify: `package.json`（devDependencies に `unzipper`, `@types/unzipper` 追加）

- [ ] **Step 1: unzipper を devDependency に追加**

Run: `npm install -D unzipper@^0.12 && npm install -D -E @types/unzipper@^0.10`
Expected: `package.json` に `unzipper` と `@types/unzipper` 追加。`npm audit` で高危険度なしを確認。

- [ ] **Step 2: テスト用 mini GTFS zip を作成**

最小の GTFS（routes/trips/shapes/stops + 必須の agency/calendar）を一時ディレクトリで作り、OS の `zip` で固めて fixture にする：

```bash
mkdir -p /tmp/mini-gtfs
cat > /tmp/mini-gtfs/agency.txt <<'EOF'
agency_id,agency_name,agency_url,agency_timezone
toei,東京都交通局,https://www.kotsu.metro.tokyo.jp/,Asia/Tokyo
EOF
cat > /tmp/mini-gtfs/calendar.txt <<'EOF'
service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date
weekday,1,1,1,1,1,0,0,20240101,20251231
EOF
cat > /tmp/mini-gtfs/routes.txt <<'EOF'
route_id,agency_id,route_short_name,route_long_name,route_type,route_color
R1,toei,草43,浅草雷門-千住車庫,3,00853F
EOF
cat > /tmp/mini-gtfs/trips.txt <<'EOF'
route_id,service_id,trip_id,shape_id
R1,weekday,T1,SH1
EOF
cat > /tmp/mini-gtfs/shapes.txt <<'EOF'
shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence
SH1,35.7115,139.7950,1
SH1,35.7155,139.7935,2
SH1,35.7440,139.8048,3
EOF
cat > /tmp/mini-gtfs/stops.txt <<'EOF'
stop_id,stop_name,stop_lat,stop_lon
S1,浅草雷門,35.7115,139.7950
S2,千住大橋,35.7440,139.8048
EOF
(cd /tmp/mini-gtfs && zip -q -r mini-toei.zip agency.txt calendar.txt routes.txt trips.txt shapes.txt stops.txt)
mkdir -p src/data/bus/gtfs/fixtures
cp /tmp/mini-gtfs/mini-toei.zip src/data/bus/gtfs/fixtures/mini-toei.zip
rm -rf /tmp/mini-gtfs
```

Expected: `src/data/bus/gtfs/fixtures/mini-toei.zip` が作成される（6ファイル入り）

- [ ] **Step 3: 失敗テストを書く**

```typescript
// src/data/bus/gtfs/parseGtfsZip.test.ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parseGtfsZip } from './parseGtfsZip.ts'

const here = dirname(fileURLToPath(import.meta.url))
const fixturePath = join(here, 'fixtures', 'mini-toei.zip')

describe('parseGtfsZip', () => {
  it('fixture zip から GTFS レコードを抽出する', async () => {
    const buffer = readFileSync(fixturePath)
    const records = await parseGtfsZip(buffer)
    expect(records.routes.map((r) => r.routeId)).toEqual(['R1'])
    expect(records.routes[0].shortName).toBe('草43')
    expect(records.routes[0].color).toBe('#00853F')
    expect(records.trips[0]).toMatchObject({ routeId: 'R1', shapeId: 'SH1' })
    expect(records.shapes).toHaveLength(3)
    expect(records.stops.map((s) => s.name)).toEqual(['浅草雷門', '千住大橋'])
  })

  it('必須ファイル欠損はエラーを投げる', async () => {
    // 空バッファで routes.txt 等の検出に失敗することを検証する。
    await expect(parseGtfsZip(Buffer.from([]))).rejects.toThrow()
  })
})
```

- [ ] **Step 4: テストを実行して失敗を確認**

Run: `npx vitest run src/data/bus/gtfs/parseGtfsZip.test.ts`
Expected: FAIL（関数未定義）

- [ ] **Step 5: 実装を書く**

```typescript
// src/data/bus/gtfs/parseGtfsZip.ts
import { Buffer } from 'node:buffer'
import unzipper from 'unzipper'
import type { GtfsRecords } from './types.ts'
import { parseCsv } from './parseCsv.ts'
import { parseRoutes, parseShapes, parseStops, parseTrips } from './parseGtfsRecords.ts'

const REQUIRED_FILES = ['routes.txt', 'trips.txt', 'shapes.txt', 'stops.txt'] as const

/**
 * GTFS-JP zip の Buffer を読み込み、型付き GTFS レコードを返す（純粋関数: 引数は Buffer、戻り値はレコード）。
 * ファイル I/O は呼び出し側が行う。必須ファイル（routes/trips/shapes/stops）欠損時は throw する。
 */
export async function parseGtfsZip(zipBuffer: Buffer): Promise<GtfsRecords> {
  const directory = await unzipper.Open.buffer(zipBuffer)
  const files = new Map<string, Buffer>()
  for (const file of directory.files) {
    files.set(file.path, await file.buffer())
  }

  const missing = REQUIRED_FILES.filter((name) => !files.has(name))
  if (missing.length > 0) {
    throw new Error(
      `GTFS 必須ファイルが見つかりません: ${missing.join(', ')}。zip 内のファイル構成を確認してください。`,
    )
  }

  const decode = (name: string): Record<string, string>[] =>
    [...parseCsv(files.get(name)!.toString('utf8'))]

  return {
    routes: parseRoutes(decode('routes.txt')),
    trips: parseTrips(decode('trips.txt')),
    shapes: parseShapes(decode('shapes.txt')),
    stops: parseStops(decode('stops.txt')),
  }
}
```

- [ ] **Step 6: テストを実行して成功を確認**

Run: `npx vitest run src/data/bus/gtfs/parseGtfsZip.test.ts`
Expected: PASS（2/2）

- [ ] **Step 7: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 8: Commit**

```bash
git add src/data/bus/gtfs/parseGtfsZip.ts src/data/bus/gtfs/parseGtfsZip.test.ts src/data/bus/gtfs/fixtures/mini-toei.zip package.json package-lock.json
git commit -m "feat(bus): GTFS zip の読み込みとレコード抽出を追加"
```

---

### Task 7: FeatureCollectionSchema 検証の組み込み確認

`buildBusFeatures` の戻り値が `FeatureCollectionSchema`（`src/domain/geojsonSchema.ts`）を満たすか、既存スキーマで検証できることをテストで保証する。

**Files:**
- Modify: `src/data/bus/gtfs/buildBusFeatures.test.ts`

- [ ] **Step 1: 検証テストを追加**

`buildBusFeatures.test.ts` の `describe` 内に追加：

```typescript
import { FeatureCollectionSchema } from '../../../domain/geojsonSchema.ts'

it('生成物は FeatureCollectionSchema で検証可能である', () => {
  const { routes, stops } = buildBusFeatures(baseRecords, { tolerance: 0 })
  expect(() => FeatureCollectionSchema.parse(routes)).not.toThrow()
  expect(() => FeatureCollectionSchema.parse(stops)).not.toThrow()
})
```

- [ ] **Step 2: テストを実行して成功を確認**

Run: `npx vitest run src/data/bus/gtfs/buildBusFeatures.test.ts`
Expected: PASS（既存 + 追加分）

- [ ] **Step 3: Commit**

```bash
git add src/data/bus/gtfs/buildBusFeatures.test.ts
git commit -m "test(bus): 生成 GeoJSON の FeatureCollectionSchema 検証を追加"
```

---

### Task 8: エントリポイント + tsconfig + package.json + 依存追加

**Files:**
- Create: `scripts/build-bus-geojson.ts`
- Modify: `tsconfig.json`
- Modify: `package.json`（`build:bus` スクリプト、`tsx` devDep）

- [ ] **Step 1: tsx を devDependency に追加**

Run: `npm install -D tsx@^4`
Expected: `package.json` に `tsx` 追加

- [ ] **Step 2: tsconfig.json の include に scripts を追加**

`tsconfig.json` の `"include": ["src", "vite.config.ts"]` を `"include": ["src", "scripts", "vite.config.ts"]` に変更。

- [ ] **Step 3: エントリポイントを作成**

```typescript
// scripts/build-bus-geojson.ts
// 都営バス GTFS-JP zip を読み込み、路線・停留所 GeoJSON（.json）を src/data/bus/ に出力する。
// 【データ取得元】公共交通オープンデータセンター / 東京都オープンデータカタログ の都営バス GTFS-JP。
//   https://catalog.data.metro.tokyo.lg.jp/dataset/t000018d0000000052
// 実行: npm run build:bus -- <path-to-gtfs.zip>
// 成果物はリポジトリにコミットする（ビルドは外部データに依存しない）。
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FeatureCollectionSchema } from '../src/domain/geojsonSchema.ts'
import { buildBusFeatures } from '../src/data/bus/gtfs/buildBusFeatures.ts'
import { parseGtfsZip } from '../src/data/bus/gtfs/parseGtfsZip.ts'

const here = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(here, '..')
const outDir = resolve(projectRoot, 'src/data/bus')

// 簡略化の許容誤差（度単位）。0.00005 度 ≒ 5.5m。
const TOLERANCE_DEG = 0.00005

async function main(): Promise<void> {
  const zipPath = process.argv[2]
  if (!zipPath) {
    console.error('使い方: npm run build:bus -- <path-to-gtfs.zip>')
    process.exit(1)
  }

  console.log(`GTFS を読み込み中: ${zipPath}`)
  const buffer = await readFile(resolve(projectRoot, zipPath))
  const records = await parseGtfsZip(buffer)
  console.log(
    `路線=${records.routes.length} trip=${records.trips.length} shape点=${records.shapes.length} 停留所=${records.stops.length}`,
  )

  const { routes, stops } = buildBusFeatures(records, { tolerance: TOLERANCE_DEG })
  // FeatureCollectionSchema で最終検証（フェイルファスト）
  const validatedRoutes = FeatureCollectionSchema.parse(routes)
  const validatedStops = FeatureCollectionSchema.parse(stops)

  await mkdir(outDir, { recursive: true })
  await writeFile(resolve(outDir, 'bus-routes.json'), JSON.stringify(validatedRoutes))
  await writeFile(resolve(outDir, 'bus-stops.json'), JSON.stringify(validatedStops))
  console.log(
    `出力完了: bus-routes.json (${routes.features.length} features), bus-stops.json (${stops.features.length} features)`,
  )
}

main().catch((error: unknown) => {
  console.error('ビルド失敗:', error)
  process.exit(1)
})
```

- [ ] **Step 4: package.json にスクリプトを追加**

`package.json` の `scripts` に `"build:bus": "tsx scripts/build-bus-geojson.ts"` を追加。

- [ ] **Step 5: 型チェック（scripts 含む）**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 6: 既存テストが壊れていないことを確認**

Run: `npm run test:run`
Expected: 全テスト PASS

- [ ] **Step 7: Commit**

```bash
git add scripts/build-bus-geojson.ts tsconfig.json package.json package-lock.json
git commit -m "feat(bus): GTFS→GeoJSON 変換エントリと build:bus スクリプトを追加"
```

---

### Task 9: 実データ取得・生成・コミット・規模実測

**Files:**
- Create: `src/data/bus/bus-routes.json`（生成物）
- Create: `src/data/bus/bus-stops.json`（生成物）
- Create: `docs/superpowers/plans/bus-data-size.md`（規模記録）

- [ ] **Step 1: 都営バス GTFS-JP をダウンロード**

東京都オープンデータカタログの都営バス GTFS-JP を取得する。

Run: `curl -L -o toei-gtfs.zip 'https://catalog.data.metro.tokyo.lg.jp/dataset/t000018d0000000052/resource/b2ed823f-4810-464b-b4ad-6c59d8ba9055/download/toei-bus-gtfs.zip'`

※ 上記 URL が 404 の場合は、カタログページ `https://catalog.data.metro.tokyo.lg.jp/dataset/t000018d0000000052` で最新の GTFS-JP リソースを確認し、正しいダウンロード URL に置き換える。ODPT（`https://ckan.odpt.org/dataset/b_bus_gtfs_jp-toei`）は要登録の場合があるため東京都カタログを優先。

Expected: `toei-gtfs.zip` がダウンロードされる（数MB〜十数MB）

- [ ] **Step 2: 変換を実行**

Run: `npm run build:bus -- toei-gtfs.zip`
Expected: コンソールに路線/trip/shape点/停留所の件数と出力完了が表示される。`src/data/bus/bus-routes.json`, `bus-stops.json` が生成される。

- [ ] **Step 3: データ規模を記録**

Run: 
```bash
echo "# 都バス GTFS 変換結果（規模記録）" > docs/superpowers/plans/bus-data-size.md
echo "" >> docs/superpowers/plans/bus-data-size.md
echo "生成日: $(date +%Y-%m-%d)  // 注: 手動で日付を確認" >> docs/superpowers/plans/bus-data-size.md
echo "" >> docs/superpowers/plans/bus-data-size.md
echo "| 成果物 | サイズ | Feature数 |" >> docs/superpowers/plans/bus-data-size.md
echo "| --- | --- | --- |" >> docs/superpowers/plans/bus-data-size.md
echo "| bus-routes.json | $(du -h src/data/bus/bus-routes.json | cut -f1) | $(node -e 'console.log(require("./src/data/bus/bus-routes.json").features.length)' 2>/dev/null || echo '?') |" >> docs/superpowers/plans/bus-data-size.md
echo "| bus-stops.json | $(du -h src/data/bus/bus-stops.json | cut -f1) | $(node -e 'console.log(require("./src/data/bus/bus-stops.json").features.length)' 2>/dev/null || echo '?') |" >> docs/superpowers/plans/bus-data-size.md
cat docs/superpowers/plans/bus-data-size.md
```

Expected: 規模記録ファイルにサイズ・Feature数が表示される。この数値は Plan 2（ロード方式: バンドル同梱 vs lazy fetch）の判断材料になる。

- [ ] **Step 4: 元 zip を削除（成果物のみコミット）**

Run: `rm toei-gtfs.zip`
※ `toei-gtfs.zip` が `.gitignore` 対象でない場合は必ず削除し、リポジトリに巨大 zip を入れない。

- [ ] **Step 5: 成果物と規模記録をコミット**

```bash
git add src/data/bus/bus-routes.json src/data/bus/bus-stops.json docs/superpowers/plans/bus-data-size.md
git commit -m "feat(bus): 都営バス全系統 GeoJSON を生成・コミット"
```

---

### Task 10: データ層 index.ts（GeoJSON import + 検証）

**Files:**
- Create: `src/data/bus/index.ts`

- [ ] **Step 1: データ層モジュールを作成**

```typescript
// src/data/bus/index.ts
// 都バス全系統の GeoJSON（build:bus で生成・コミットした成果物）。
// 起動時に FeatureCollectionSchema で検証し、不正ならフェイルファスト。
import type { FeatureCollection } from 'geojson'
import { FeatureCollectionSchema } from '../../domain/geojsonSchema.ts'
import busRoutes from './bus-routes.json' with { type: 'json' }
import busStops from './bus-stops.json' with { type: 'json' }

/** 都バス路線（LineString、道路上の正確な経路）。イミュータブル。 */
export const busRoutes: readonly FeatureCollection[] = Object.freeze([
  FeatureCollectionSchema.parse(busRoutes),
])

/** 都バス停留所（Point）。イミュータブル。 */
export const busStops: readonly FeatureCollection[] = Object.freeze([
  FeatureCollectionSchema.parse(busStops),
])
```

- [ ] **Step 2: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし（`resolveJsonModule: true` により `.json` import が解決される）

- [ ] **Step 3: 単体テストを追加**

```typescript
// src/data/bus/index.test.ts
import { describe, expect, it } from 'vitest'
import { busRoutes, busStops } from './index.ts'

describe('bus data', () => {
  it('路線・停留所とも FeatureCollection を1つ以上持つ', () => {
    expect(busRoutes.length).toBeGreaterThan(0)
    expect(busStops.length).toBeGreaterThan(0)
    for (const fc of busRoutes) {
      expect(fc.type).toBe('FeatureCollection')
      expect(fc.features.length).toBeGreaterThan(0)
    }
  })

  it('路線 Feature は kind=bus-route と color を持つ', () => {
    const f = busRoutes[0].features[0]
    expect(f.properties?.kind).toBe('bus-route')
    expect(typeof f.properties?.color).toBe('string')
  })
})
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/data/bus/index.test.ts`
Expected: PASS

- [ ] **Step 5: カバレッジが 80% 閾値を維持することを確認**

Run: `npm run test:coverage`
Expected: 全テスト PASS。`src/data/` 配下のカバレッジが lines/functions/branches/statements とも 80% 以上。

- [ ] **Step 6: Commit**

```bash
git add src/data/bus/index.ts src/data/bus/index.test.ts
git commit -m "feat(bus): 都バス GeoJSON のデータ層と zod 検証を追加"
```

---

## Plan 1 完了条件

- [ ] `npm run build:bus -- <gtfs.zip>` で `src/data/bus/bus-routes.json` / `bus-stops.json` が生成される
- [ ] 生成物がコミット済みで、規模（サイズ・Feature数）が `docs/superpowers/plans/bus-data-size.md` に記録されている
- [ ] `src/data/bus/gtfs/` の純粋関数がすべてテスト PASS（カバレッジ 80% 以上）
- [ ] `npm run typecheck` / `npm run test:run` がすべて PASS
- [ ] `src/data/bus/index.ts` から GeoJSON が import・検証可能

## 次のステップ（Plan 2 への引き継ぎ）

Plan 2（アプリ統合）は `docs/superpowers/plans/bus-data-size.md` の規模を実測後に作成する。規模に応じて以下を決定する：
- **ロード方式**: 数MB 以下ならバンドル同梱（`index.ts` の import）、大きければ lazy fetch（`public/` 配信 + トグル/ズーム契機）
- その後、レイヤー追加・BusToggle・tooltip・草43統合・README 更新を計画する。
