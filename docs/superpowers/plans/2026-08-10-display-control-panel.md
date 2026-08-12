# 表示制御パネル 実装計画（事業者カテゴリ + 地図要素レイヤー）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 地図の表示対象を「事業者カテゴリ（JR/メトロ/都営/私鉄/その他）」と「地図要素（駅/振替/バス）」の両軸で選択できるようにし、状態を Reducer に集約して拡張性を高める。

**Architecture:** `Line` に `category` を追加し、表示ON/OFF系の状態を `DisplayState`（`useReducer`）に一元管理。表示判定は純粋関数（`displayVisibility.ts`/`filters.ts`）で行い、折りたたみ式の `DisplayPanel` から操作する。`BusToggle` はパネル内「バス」に統合して廃止。`suspensionMode` は独立維持。

**Tech Stack:** TypeScript 7 / React 19 / MapLibre GL JS 6 / zod 4 / Vitest（環境 node・coverage 80%閾値）

**設計書:** `docs/superpowers/specs/2026-08-10-display-control-panel-design.md`

---

## File Structure

**Create:**
- `src/domain/displayVisibility.ts` + `.test.ts` — `DisplayState` 型・表示判定純粋関数・Reducer
- `src/map/useDisplayState.ts` — `useReducer` の thin ラッパ（型チェックのみ・coverage 対象外）
- `src/ui/DisplayPanel.tsx` — 折りたたみ式表示設定パネル

**Modify:**
- `src/domain/schemas.ts` — `LineCategorySchema`/`category` 追加
- `src/domain/schemas.test.ts` — category バリデーション
- `src/data/lines/*.ts`（23路線）— `category` 追加
- `src/data/index.test.ts` — 全路線 category 設定済みテスト
- `src/map/filters.ts` — `buildHiddenLineFilter` → `buildLineFilter` 拡張
- `src/map/filters.test.ts` — カテゴリ込みフィルタテスト
- `src/geojson/builders.ts` — feature に `category` 付与
- `src/geojson/builders.test.ts` — category 付与テスト・テストデータに category 追加
- `src/map/MapContainer.tsx` — Props 変更・フィルタ/visibility 適用
- `src/App.tsx` — `useDisplayState` 導入・`DisplayPanel` 配置・`BusToggle` 削除
- `src/ui/Legend.tsx` — **変更なし**（App から `hiddenLineIds`/`busVisible` 受け取り継続）
- `src/index.css` — `.bus-toggle` 削除・`.display-panel` 系追加
- `README.md` — 機能説明追記

**Delete:**
- `src/ui/BusToggle.tsx`

---

### Task 1: LineCategorySchema 追加（optional）

`LineSchema` に `category` を optional で追加する。この時点では必須にせず、既存路線データ（category なし）も typecheck 通るようにする（Task 2 で必須化）。

**Files:**
- Modify: `src/domain/schemas.ts`
- Modify: `src/domain/schemas.test.ts`

- [ ] **Step 1: schemas.ts に LineCategorySchema と category を追加**

`src/domain/schemas.ts` の `LineSchema` 定義の前に `LineCategorySchema` を追加し、`LineSchema` に `category` を optional 追加する。

`LineSchema` の直前（`export const LineSchema = z.object({` の前）に挿入:
```typescript
/**
 * 路線の事業者カテゴリ（表示制御パネルのグループ選択用）。
 * jr: JR / metro: 東京メトロ / toei: 都営交通 / private: 私鉄 / other: 第三セクター等
 */
export const LineCategorySchema = z.enum(['jr', 'metro', 'toei', 'private', 'other'])
export type LineCategory = z.infer<typeof LineCategorySchema>
```

`LineSchema` の `mode: z.enum(['rail', 'bus', 'tram']).optional(),` の次に追加:
```typescript
  category: LineCategorySchema.optional(),
```

- [ ] **Step 2: schemas.test.ts に category のテストを追加**

`src/domain/schemas.test.ts` の `describe('LineSchema', ...)` ブロック内（`mode` 関連テストの後）に追加:
```typescript
  it('category に jr/metro/toei/private/other を受理する', () => {
    expect(LineSchema.parse({ ...baseLine, category: 'jr' }).category).toBe('jr')
    expect(LineSchema.parse({ ...baseLine, category: 'metro' }).category).toBe('metro')
    expect(LineSchema.parse({ ...baseLine, category: 'toei' }).category).toBe('toei')
    expect(LineSchema.parse({ ...baseLine, category: 'private' }).category).toBe('private')
    expect(LineSchema.parse({ ...baseLine, category: 'other' }).category).toBe('other')
  })

  it('無効な category を拒否する', () => {
    expect(() => LineSchema.parse({ ...baseLine, category: 'shinkansen' })).toThrow()
  })

  it('category を省略できる（Task 2 で必須化するまで）', () => {
    expect(LineSchema.parse(baseLine).category).toBeUndefined()
  })
```

- [ ] **Step 3: テスト・型チェック**

Run: `npx vitest run src/domain/schemas.test.ts && npm run typecheck`
Expected: テスト全 PASS・型エラーなし（category は optional のため既存路線データも OK）

- [ ] **Step 4: Commit**

```bash
git add src/domain/schemas.ts src/domain/schemas.test.ts
git commit -m "feat(display): LineCategorySchema と category(optional) を追加"
```

---

### Task 2: 23路線に category を付与し必須化

23路線すべてに `category` を設定し、スキーマを必須化する。あわせてテスト内の路線データ（`builders.test.ts`/`schemas.test.ts` の `baseLine`）にも category を追加する。

**Files:**
- Modify: `src/domain/schemas.ts`（category を必須化）
- Modify: `src/data/lines/*.ts`（23路線）
- Modify: `src/geojson/builders.test.ts`（テストデータ `line` に category 追加）
- Modify: `src/domain/schemas.test.ts`（「省略できる」テストを「必須」に変更）
- Modify: `src/data/index.test.ts`（全路線 category 設定済みテスト）

**23路線の category 割当:**

| category | 路線ファイル（id） |
|----------|-------------------|
| `jr` | `yamanoteLine.ts`(yamanote), `chuoSobuLocalLine.ts`(chuoSobuLocal) |
| `metro` | `chiyodaLine.ts`, `fukutoshinLine.ts`, `ginzaLine.ts`, `hanzomonLine.ts`, `hibiyaLine.ts`, `marunouchiLine.ts`, `nambokuLine.ts`, `tozaiLine.ts`, `yurakuchoLine.ts` |
| `toei` | `asakusaLine.ts`, `oedoLine.ts`, `mitaLine.ts`, `shinjukuLine.ts`, `todenArakawaLine.ts`, `nipporiToneriLinerLine.ts` |
| `private` | `keikyuLine.ts`, `keiseiLine.ts`, `odakyuLine.ts`, `seibuShinjukuLine.ts`, `toyokoLine.ts` |
| `other` | `tsukubaExpress.ts` |

- [ ] **Step 1: 各路線ファイルに category を追加**

各 `src/data/lines/<file>.ts` の路線オブジェクトに、`color` プロパティの次に `category` を1行追加する。例（`asakusaLine.ts`）:
```typescript
export const asakusaLine: Line = {
  id: 'asakusa',
  name: '都営浅草線',
  color: '#e8472e',
  category: 'toei',
  stations: [
```

上記割当表に従い、23ファイルすべてに追加すること（metro は9ファイル・toei は6ファイル等）。各ファイルで `color: '#xxxxxx',` の直下行に `  category: '<値>',` を挿入する。

- [ ] **Step 2: schemas.ts で category を必須化**

`src/domain/schemas.ts` の `category: LineCategorySchema.optional(),` を以下に置換:
```typescript
  category: LineCategorySchema,
```

- [ ] **Step 3: schemas.test.ts の「省略できる」テストを必須違反に変更**

`src/domain/schemas.test.ts` の「category を省略できる（Task 2 で必須化するまで）」テストを以下に置換:
```typescript
  it('category 省略を拒否する（必須）', () => {
    const { category, ...withoutCategory } = { ...baseLine, category: 'jr' }
    void category
    expect(() => LineSchema.parse(withoutCategory)).toThrow()
  })
```

- [ ] **Step 4: builders.test.ts のテストデータに category を追加**

`src/geojson/builders.test.ts` の `line` 定義（26行目付近）に `category` を追加:
```typescript
const line: Line = {
  id: 'l1',
  name: '路線1',
  color: '#e60012',
  category: 'jr',
  stations: [stationA, stationB],
}
```

- [ ] **Step 5: index.test.ts に全路線 category 設定済みテストを追加**

`src/data/index.test.ts` の `describe('lines（路線データ）', ...)` ブロック内（路線色テストの後）に追加:
```typescript
  it('全路線に category（jr/metro/toei/private/other）が設定されている', () => {
    const valid = ['jr', 'metro', 'toei', 'private', 'other'] as const
    for (const line of lines) {
      expect(valid).toContain(line.category)
    }
  })
```

- [ ] **Step 6: テスト・型チェック**

Run: `npm run test:run && npm run typecheck`
Expected: 全テスト PASS（106 + 追加分）・型エラーなし（23路線すべてに category あり・テストデータも更新済み）

- [ ] **Step 7: Commit**

```bash
git add src/domain/schemas.ts src/domain/schemas.test.ts src/data/lines src/geojson/builders.test.ts src/data/index.test.ts
git commit -m "feat(display): 23路線に category を付与し必須化"
```

---

### Task 3: displayVisibility.ts（型 + 純粋関数 + Reducer）— TDD

表示判定と状態遷移の純粋関数を定義する。coverage 対象（`src/domain/**`）。

**Files:**
- Create: `src/domain/displayVisibility.ts`
- Test: `src/domain/displayVisibility.test.ts`

- [ ] **Step 1: 失敗テストを書く**

`src/domain/displayVisibility.test.ts` を作成:
```typescript
import { describe, expect, it } from 'vitest'
import {
  INITIAL_DISPLAY_STATE,
  displayReducer,
  isLayerVisible,
  isLineVisible,
  type DisplayState,
} from './displayVisibility.ts'

describe('isLineVisible', () => {
  const line = { id: 'yamanote', category: 'jr' as const }

  it('個別・カテゴリとも表示なら visible', () => {
    expect(isLineVisible(line, INITIAL_DISPLAY_STATE)).toBe(true)
  })

  it('個別OFFなら非表示', () => {
    const state: DisplayState = {
      ...INITIAL_DISPLAY_STATE,
      hiddenLineIds: new Set(['yamanote']),
    }
    expect(isLineVisible(line, state)).toBe(false)
  })

  it('カテゴリOFFなら非表示（個別ONでもカテゴリ優先）', () => {
    const state: DisplayState = {
      ...INITIAL_DISPLAY_STATE,
      categoryHidden: new Set(['jr']),
    }
    expect(isLineVisible(line, state)).toBe(false)
  })

  it('個別・カテゴリ両方OFFなら非表示', () => {
    const state: DisplayState = {
      categoryHidden: new Set(['jr']),
      hiddenLineIds: new Set(['yamanote']),
      layerHidden: new Set(),
    }
    expect(isLineVisible(line, state)).toBe(false)
  })
})

describe('isLayerVisible', () => {
  it('layerHidden に無ければ visible', () => {
    expect(isLayerVisible('stations', INITIAL_DISPLAY_STATE)).toBe(true)
  })

  it('layerHidden にあれば非表示', () => {
    const state: DisplayState = {
      ...INITIAL_DISPLAY_STATE,
      layerHidden: new Set(['stations', 'bus']),
    }
    expect(isLayerVisible('stations', state)).toBe(false)
    expect(isLayerVisible('bus', state)).toBe(false)
    expect(isLayerVisible('transfers', state)).toBe(true)
  })
})

describe('displayReducer', () => {
  it('toggleCategory がカテゴリを隠す/再表示する', () => {
    const hidden = displayReducer(INITIAL_DISPLAY_STATE, {
      type: 'toggleCategory',
      category: 'jr',
    })
    expect(hidden.categoryHidden.has('jr')).toBe(true)
    const shown = displayReducer(hidden, { type: 'toggleCategory', category: 'jr' })
    expect(shown.categoryHidden.has('jr')).toBe(false)
  })

  it('toggleLine が路線を隠す/再表示する', () => {
    const hidden = displayReducer(INITIAL_DISPLAY_STATE, {
      type: 'toggleLine',
      lineId: 'ginza',
    })
    expect(hidden.hiddenLineIds.has('ginza')).toBe(true)
  })

  it('toggleLayer が要素を隠す/再表示する', () => {
    const hidden = displayReducer(INITIAL_DISPLAY_STATE, {
      type: 'toggleLayer',
      layer: 'bus',
    })
    expect(hidden.layerHidden.has('bus')).toBe(true)
  })

  it('元の state を破壊しない（イミュータブル）', () => {
    displayReducer(INITIAL_DISPLAY_STATE, { type: 'toggleCategory', category: 'jr' })
    displayReducer(INITIAL_DISPLAY_STATE, { type: 'toggleLine', lineId: 'ginza' })
    displayReducer(INITIAL_DISPLAY_STATE, { type: 'toggleLayer', layer: 'bus' })
    expect(INITIAL_DISPLAY_STATE.categoryHidden.size).toBe(0)
    expect(INITIAL_DISPLAY_STATE.hiddenLineIds.size).toBe(0)
    expect(INITIAL_DISPLAY_STATE.layerHidden.size).toBe(0)
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npx vitest run src/domain/displayVisibility.test.ts`
Expected: FAIL（モジュールなし）

- [ ] **Step 3: 実装を書く**

`src/domain/displayVisibility.ts` を作成:
```typescript
import type { LineCategory } from './schemas.ts'

/** 表示制御の事業者カテゴリ（LineCategory と同値）。 */
export type Category = LineCategory

/** 表示制御対象の地図要素レイヤー。 */
export type LayerKey = 'stations' | 'transfers' | 'bus'

/** 表示ON/OFFの状態（イミュータブル）。suspensionMode は別管理。 */
export interface DisplayState {
  readonly categoryHidden: ReadonlySet<Category>
  readonly hiddenLineIds: ReadonlySet<string>
  readonly layerHidden: ReadonlySet<LayerKey>
}

/** 初期状態: すべて表示（全集合 空）。 */
export const INITIAL_DISPLAY_STATE: DisplayState = {
  categoryHidden: new Set(),
  hiddenLineIds: new Set(),
  layerHidden: new Set(),
}

/**
 * 路線が表示対象か。個別OFF または カテゴリOFF なら非表示（AND結合・カテゴリ優先）。
 */
export function isLineVisible(
  line: { id: string; category: Category },
  state: DisplayState,
): boolean {
  return !state.hiddenLineIds.has(line.id) && !state.categoryHidden.has(line.category)
}

/** 地図要素レイヤーが表示対象か。 */
export function isLayerVisible(layer: LayerKey, state: DisplayState): boolean {
  return !state.layerHidden.has(layer)
}

/** 表示状態の操作アクション。 */
export type DisplayAction =
  | { type: 'toggleCategory'; category: Category }
  | { type: 'toggleLine'; lineId: string }
  | { type: 'toggleLayer'; layer: LayerKey }

/** Set 内の値の有無を切替え、新しい Set を返す（イミュータブル）。 */
function toggleInSet<T>(set: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }
  return next
}

/** 表示状態の Reducer（純粋関数・テスト対象）。 */
export function displayReducer(state: DisplayState, action: DisplayAction): DisplayState {
  switch (action.type) {
    case 'toggleCategory':
      return {
        ...state,
        categoryHidden: toggleInSet(state.categoryHidden, action.category),
      }
    case 'toggleLine':
      return {
        ...state,
        hiddenLineIds: toggleInSet(state.hiddenLineIds, action.lineId),
      }
    case 'toggleLayer':
      return {
        ...state,
        layerHidden: toggleInSet(state.layerHidden, action.layer),
      }
  }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/domain/displayVisibility.test.ts`
Expected: PASS（全ケース）

- [ ] **Step 5: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 6: Commit**

```bash
git add src/domain/displayVisibility.ts src/domain/displayVisibility.test.ts
git commit -m "feat(display): 表示判定・Reducer の純粋関数を追加"
```

---

### Task 4: filters.ts の buildLineFilter 拡張 — TDD

`buildHiddenLineFilter` を `buildLineFilter`（カテゴリ込み）へ置換する。coverage 対象（`src/map/filters.ts`）。

**Files:**
- Modify: `src/map/filters.ts`
- Modify: `src/map/filters.test.ts`

- [ ] **Step 1: テストを書き換える**

`src/map/filters.test.ts` を以下に差し替え:
```typescript
import { describe, expect, it } from 'vitest'
import { buildLineFilter } from './filters.ts'

describe('buildLineFilter', () => {
  it('隠し対象が空なら全表示（all）', () => {
    expect(buildLineFilter(new Set(), new Set(), 'id')).toEqual(['all'])
  })

  it('路線IDのみ非表示のフィルタを生成', () => {
    expect(buildLineFilter(new Set(['yamanote', 'ginza']), new Set(), 'id')).toEqual([
      'all',
      ['match', ['get', 'id'], ['yamanote', 'ginza'], false, true],
    ])
  })

  it('カテゴリのみ非表示のフィルタを生成', () => {
    expect(buildLineFilter(new Set(), new Set(['jr', 'toei']), 'id')).toEqual([
      'all',
      ['match', ['get', 'category'], ['jr', 'toei'], false, true],
    ])
  })

  it('路線IDとカテゴリ両方の条件を AND 結合', () => {
    expect(buildLineFilter(new Set(['yamanote']), new Set(['jr']), 'id')).toEqual([
      'all',
      ['match', ['get', 'id'], ['yamanote'], false, true],
      ['match', ['get', 'category'], ['jr'], false, true],
    ])
  })

  it('property=lineId で駅レイヤー用フィルタを生成', () => {
    expect(buildLineFilter(new Set(['yamanote']), new Set(), 'lineId')).toEqual([
      'all',
      ['match', ['get', 'lineId'], ['yamanote'], false, true],
    ])
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npx vitest run src/map/filters.test.ts`
Expected: FAIL（`buildLineFilter` 未定義／`buildHiddenLineFilter` 仍在）

- [ ] **Step 3: filters.ts に buildLineFilter を追加**

`src/map/filters.ts` を変更する。**既存 `buildHiddenLineFilter` は残す**（Task 8 で MapContainer を切替後に削除。残せば Task 4 単独でも typecheck が通る）。

先頭 import に `Category` を追加:
```typescript
import type { FilterSpecification } from 'maplibre-gl'
import type { Category } from '../domain/displayVisibility.ts'
```

ファイル末尾（`buildHiddenLineFilter` の後）に `buildLineFilter` を追加:
```typescript
/**
 * 非表示路線ID集合と非表示カテゴリ集合から、MapLibre レイヤー用フィルタ式を構築する（純粋関数）。
 * - 両方空のときは ['all']（条件なし＝全表示）。
 * - いずれか非空のときは「id が hidden でない AND category が hidden でない」を表す
 *   match 式を ['all', ...] で結合する（AND結合・カテゴリ優先）。
 *
 * property='id' は路線レイヤー、property='lineId' は駅レイヤー用。
 * category は路線・駅どちらも feature.properties.category を参照する。
 */
export function buildLineFilter(
  hiddenLineIds: ReadonlySet<string>,
  categoryHidden: ReadonlySet<Category>,
  idProperty: 'id' | 'lineId',
): FilterSpecification {
  const conditions: FilterSpecification[] = []
  if (hiddenLineIds.size > 0) {
    conditions.push(['match', ['get', idProperty], [...hiddenLineIds], false, true])
  }
  if (categoryHidden.size > 0) {
    conditions.push(['match', ['get', 'category'], [...categoryHidden], false, true])
  }
  if (conditions.length === 0) return ['all']
  return ['all', ...conditions]
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/map/filters.test.ts`
Expected: PASS

- [ ] **Step 5: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし（`buildHiddenLineFilter` を残置しているため `MapContainer` も引き続き型エラーなし。`buildHiddenLineFilter` は Task 8 で削除）

- [ ] **Step 6: Commit**

```bash
git add src/map/filters.ts src/map/filters.test.ts
git commit -m "feat(display): buildLineFilter にカテゴリ条件を統合"
```

---

### Task 5: builders.ts に category を付与 — TDD

路線・駅 feature の `properties` に `category` を持たせる。coverage 対象（`src/geojson/**`）。

**Files:**
- Modify: `src/geojson/builders.ts`
- Modify: `src/geojson/builders.test.ts`

- [ ] **Step 1: テストを追加**

`src/geojson/builders.test.ts` の `describe('buildLineFeature', ...)` ブロック内（mode テストの後）に追加:
```typescript
  it('category を properties に保持する', () => {
    const metroLine: Line = { ...line, category: 'metro' }
    expect(buildLineFeature(metroLine).properties).toMatchObject({ category: 'metro' })
  })
```

`describe('buildStationPoint', ...)` ブロック内（mode テストの後）に追加:
```typescript
  it('category を properties に保持する', () => {
    expect(
      buildStationPoint(stationA, '#e60012', 'toei').properties,
    ).toMatchObject({ category: 'toei' })
  })
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npx vitest run src/geojson/builders.test.ts`
Expected: FAIL（`buildStationPoint` の引数不足／category プロパティなし）

- [ ] **Step 3: builders.ts を実装**

`src/geojson/builders.ts` を変更する。

`import type { Line, Station, Transfer }` 行の次に追加:
```typescript
import type { LineCategory } from '../domain/schemas.ts'
```

`buildStationPoint` を以下に置換:
```typescript
/** 駅を GeoJSON の Point Feature に変換する（座標は [lon, lat] 順）。 */
export function buildStationPoint(
  station: Station,
  color: string,
  category: LineCategory,
): Feature {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [station.lon, station.lat] },
    properties: {
      kind: 'station',
      id: station.id,
      name: station.name,
      lineId: station.lineId,
      color,
      mode: station.mode,
      category,
    },
  }
}
```

`buildLineFeature` の `properties` に `category: line.category,` を追加（`mode: line.mode,` の次）:
```typescript
    properties: {
      kind: 'line',
      id: line.id,
      name: line.name,
      color: line.color,
      mode: line.mode,
      category: line.category,
    },
```

`buildStationsCollection` の `buildStationPoint` 呼出に `line.category` を追加:
```typescript
  const features = lines.flatMap((line) =>
    line.stations.map((station) =>
      buildStationPoint(station, line.color, line.category),
    ),
  )
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `npx vitest run src/geojson/builders.test.ts`
Expected: PASS

- [ ] **Step 5: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 6: Commit**

```bash
git add src/geojson/builders.ts src/geojson/builders.test.ts
git commit -m "feat(display): 路線・駅 feature に category を付与"
```

---

### Task 6: useDisplayState フック（thin ラッパ）

`displayReducer` を React から利用するための thin フック。coverage 対象外（型チェックで担保）。

**Files:**
- Create: `src/map/useDisplayState.ts`

- [ ] **Step 1: useDisplayState を実装**

`src/map/useDisplayState.ts` を作成:
```typescript
import { useCallback, useReducer } from 'react'
import {
  INITIAL_DISPLAY_STATE,
  displayReducer,
  type Category,
  type DisplayState,
  type LayerKey,
} from '../domain/displayVisibility.ts'

/** 表示状態の保持と操作を提供するフック（Reducer の thin ラッパ）。 */
export function useDisplayState(): {
  state: DisplayState
  toggleCategory: (category: Category) => void
  toggleLine: (lineId: string) => void
  toggleLayer: (layer: LayerKey) => void
} {
  const [state, dispatch] = useReducer(displayReducer, INITIAL_DISPLAY_STATE)
  const toggleCategory = useCallback(
    (category: Category) => dispatch({ type: 'toggleCategory', category }),
    [],
  )
  const toggleLine = useCallback(
    (lineId: string) => dispatch({ type: 'toggleLine', lineId }),
    [],
  )
  const toggleLayer = useCallback(
    (layer: LayerKey) => dispatch({ type: 'toggleLayer', layer }),
    [],
  )
  return { state, toggleCategory, toggleLine, toggleLayer }
}
```

- [ ] **Step 2: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 3: Commit**

```bash
git add src/map/useDisplayState.ts
git commit -m "feat(display): useDisplayState フックを追加"
```

---

### Task 7: DisplayPanel + CSS

折りたたみ式の表示設定パネルを実装する。

**Files:**
- Create: `src/ui/DisplayPanel.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: DisplayPanel を実装**

`src/ui/DisplayPanel.tsx` を作成:
```typescript
import { useState } from 'react'
import {
  isLayerVisible,
  type Category,
  type DisplayState,
  type LayerKey,
} from '../domain/displayVisibility.ts'

interface Props {
  state: DisplayState
  onToggleCategory: (category: Category) => void
  onToggleLayer: (layer: LayerKey) => void
}

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'jr', label: 'JR' },
  { key: 'metro', label: '東京メトロ' },
  { key: 'toei', label: '都営' },
  { key: 'private', label: '私鉄' },
  { key: 'other', label: 'その他' },
]

const LAYERS: { key: LayerKey; label: string }[] = [
  { key: 'stations', label: '駅' },
  { key: 'transfers', label: '振替ルート' },
  { key: 'bus', label: '都バス' },
]

/**
 * 表示設定パネル（折りたたみ式）。事業者カテゴリと地図要素レイヤーの
 * 表示ON/OFFを切り替える。開閉状態はローカル。
 */
export function DisplayPanel({ state, onToggleCategory, onToggleLayer }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="display-panel">
      <button
        type="button"
        className="display-panel-button"
        aria-expanded={open}
        aria-controls="display-panel-content"
        onClick={() => setOpen((prev) => !prev)}
      >
        🎛️ 表示
      </button>
      {open && (
        <div className="display-panel-content" id="display-panel-content">
          <p className="display-panel-label">事業者</p>
          <div className="display-panel-group">
            {CATEGORIES.map((c) => {
              const visible = !state.categoryHidden.has(c.key)
              return (
                <button
                  key={c.key}
                  type="button"
                  className={`display-panel-chip${visible ? ' active' : ''}`}
                  aria-pressed={visible}
                  onClick={() => onToggleCategory(c.key)}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          <p className="display-panel-label">地図要素</p>
          <div className="display-panel-group">
            {LAYERS.map((l) => {
              const visible = isLayerVisible(l.key, state)
              return (
                <button
                  key={l.key}
                  type="button"
                  className={`display-panel-chip${visible ? ' active' : ''}`}
                  aria-pressed={visible}
                  onClick={() => onToggleLayer(l.key)}
                >
                  {l.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: CSS を追加**

`src/index.css` の末尾に追加:
```css
/* 表示設定パネル（地図左上オーバーレイ・運休トグルの下） */
.display-panel {
  position: absolute;
  top: 54px;
  left: 12px;
  z-index: 1;
}
.display-panel-button {
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
.display-panel-button:hover {
  background: #ffffff;
}
.display-panel-content {
  margin-top: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.display-panel-label {
  margin: 4px 0;
  font-size: 11px;
  font-weight: 600;
  color: #666666;
}
.display-panel-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}
.display-panel-chip {
  padding: 4px 10px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  background: #ffffff;
  color: #666666;
  font-size: 12px;
  cursor: pointer;
}
.display-panel-chip:hover {
  border-color: #999999;
}
.display-panel-chip.active {
  background: #1a1a1a;
  color: #ffffff;
  border-color: #1a1a1a;
}
```

- [ ] **Step 3: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 4: Commit**

```bash
git add src/ui/DisplayPanel.tsx src/index.css
git commit -m "feat(display): 折りたたみ式表示設定パネル DisplayPanel を追加"
```

---

### Task 8: MapContainer 統合（フィルタ・visibility）

`MapContainer` の Props を `displayState` に置き換え、カテゴリ込みフィルタと駅/振替/バスの visibility を適用する。

**Files:**
- Modify: `src/map/MapContainer.tsx`

- [ ] **Step 1: Props と import を変更**

`src/map/MapContainer.tsx` を変更する。

import 行（`buildHiddenLineFilter` を置換）:
```typescript
import { useBusLayers } from './useBusLayers.ts'
```
の次に追加、および `import { buildHiddenLineFilter } from './filters.ts'` を:
```typescript
import { buildLineFilter } from './filters.ts'
import {
  INITIAL_DISPLAY_STATE,
  isLayerVisible,
  type DisplayState,
} from '../domain/displayVisibility.ts'
```
に置換。

`Props` interface の `hiddenLineIds: ReadonlySet<string>` と `busVisible: boolean` を:
```typescript
  displayState: DisplayState
```
に置換。

関数引数分割代入（`hiddenLineIds,` `busVisible,` を `displayState,` に置換）:
```typescript
export function MapContainer({
  lines,
  transfers,
  stationsById,
  displayState,
  suspensionMode,
  focusTarget,
  onFocusConsumed,
}: Props) {
```

- [ ] **Step 2: useBusLayers 呼出を displayState ベースに**

`useBusLayers({ map: mapRef.current, ready, busVisible })` を:
```typescript
  useBusLayers({ map: mapRef.current, ready, busVisible: isLayerVisible('bus', displayState) })
```
に置換。

- [ ] **Step 3: フィルタ適用 effect をカテゴリ込みに**

「非表示路線のフィルタ適用」effect を以下に置換:
```typescript
  // 非表示路線/カテゴリのフィルタ適用。addDataLayers の effect が先行して layer を追加するため、
  // 防御的に layer 存在を確認してから setFilter する。
  useEffect(() => {
    if (!ready) return
    const map = mapRef.current
    if (!map) return
    if (!map.getLayer(LAYER_IDS.lines) || !map.getLayer(LAYER_IDS.stations)) {
      return
    }
    map.setFilter(
      LAYER_IDS.lines,
      buildLineFilter(displayState.hiddenLineIds, displayState.categoryHidden, 'id'),
    )
    map.setFilter(
      LAYER_IDS.stations,
      buildLineFilter(displayState.hiddenLineIds, displayState.categoryHidden, 'lineId'),
    )
  }, [ready, displayState, mapRef])
```

- [ ] **Step 4: 駅・振替の visibility 切替 effect を追加**

`suspensionMode` の paint effect の前に、要素レイヤー visibility の effect を追加:
```typescript
  // 駅・振替レイヤーの表示切替（DisplayPanel の要素ON/OFF）。
  useEffect(() => {
    if (!ready) return
    const map = mapRef.current
    if (!map) return
    const stationVisibility = isLayerVisible('stations', displayState) ? 'visible' : 'none'
    const transferVisibility = isLayerVisible('transfers', displayState) ? 'visible' : 'none'
    if (map.getLayer(LAYER_IDS.stations)) {
      map.setLayoutProperty(LAYER_IDS.stations, 'visibility', stationVisibility)
    }
    if (map.getLayer(LAYER_IDS.transfers)) {
      map.setLayoutProperty(LAYER_IDS.transfers, 'visibility', transferVisibility)
    }
  }, [ready, displayState, mapRef])
```

- [ ] **Step 5: filters.ts から未使用の buildHiddenLineFilter を削除**

`src/map/filters.ts` から `buildHiddenLineFilter` 関数とその JSDoc を削除する（Step 3 で MapContainer は `buildLineFilter` に切替済みのため参照なし）。

- [ ] **Step 6: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし（App 側も Task 9 で更新が必要だが、MapContainer 単体は型エラーなし。App が旧 Props で呼ぶとエラーになるため Task 9 で即座に解消）

- [ ] **Step 7: Commit**

```bash
git add src/map/MapContainer.tsx src/map/filters.ts
git commit -m "feat(display): MapContainer を displayState でカテゴリ/要素制御"
```

---

### Task 9: App 統合 + BusToggle 削除

`App` に `useDisplayState` を導入し、`DisplayPanel` を配置、`BusToggle` を廃止する。

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/ui/BusToggle.tsx`
- Modify: `src/index.css`（`.bus-toggle` 系削除）

- [ ] **Step 1: App.tsx を変更**

`src/App.tsx` を変更する。

import 行で `BusToggle` を削除し、`DisplayPanel` と `useDisplayState`/`isLayerVisible` を追加:
```typescript
import { Legend } from './ui/Legend.tsx'
import { DisplayPanel } from './ui/DisplayPanel.tsx'
import { SuspensionToggle } from './ui/SuspensionToggle.tsx'
import { TransferListView } from './ui/TransferListView.tsx'
import { useDisplayState } from './map/useDisplayState.ts'
import { isLayerVisible } from './domain/displayVisibility.ts'
```
（`import { BusToggle } from './ui/BusToggle.tsx'` を削除）

`App` 関数本体の state 宣言を変更。`hiddenLineIds`/`setHiddenLineIds` と `busVisible`/`setBusVisible` を削除し、`useDisplayState` を導入:
```typescript
export function App() {
  const [tab, setTab] = useState<Tab>('map')
  const display = useDisplayState()
  // 山手線運休モード（山手線を薄くし、振替ルートを強調）
  const [suspensionMode, setSuspensionMode] = useState(false)
  // リスト→地図へのジャンプ対象。消費後 null に戻し再ジャンプを可能にする。
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)
```

`toggleLine` 関数（37-47行）を削除（`display.toggleLine` に置換）。

`MapContainer` 呼出の props を変更:
```tsx
            <MapContainer
              lines={lines}
              transfers={allTransfers}
              stationsById={stationsById}
              displayState={display.state}
              suspensionMode={suspensionMode}
              focusTarget={focusTarget}
              onFocusConsumed={handleFocusConsumed}
            />
```

`<BusToggle .../>` ブロックを `<DisplayPanel .../>` に置換:
```tsx
            <SuspensionToggle
              active={suspensionMode}
              onToggle={() => setSuspensionMode((prev) => !prev)}
            />
            <DisplayPanel
              state={display.state}
              onToggleCategory={display.toggleCategory}
              onToggleLayer={display.toggleLayer}
            />
```

`<Legend .../>` の props を変更（`toggleLine` → `display.toggleLine`、`busVisible` を `isLayerVisible` で計算）:
```tsx
            <Legend
              lines={lines}
              hiddenLineIds={display.state.hiddenLineIds}
              onToggleLine={display.toggleLine}
              busVisible={isLayerVisible('bus', display.state)}
            />
```

- [ ] **Step 2: BusToggle.tsx を削除**

Run: `git rm src/ui/BusToggle.tsx`

- [ ] **Step 3: index.css の .bus-toggle 系を削除**

`src/index.css` の以下ブロックを削除:
```css
.bus-toggle { ... }
.bus-toggle:hover { ... }
.bus-toggle.active { ... }
```
（`.bus-toggle` で始まる3つのルールブロック全体）

- [ ] **Step 4: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし（BusToggle 参照解消・App/MapContainer/Legend の props 整合）

- [ ] **Step 5: 手動確認**

Run: `npm run dev`
Expected:
- 左上に「🚧 運休」（SuspensionToggle）と「🎛️ 表示」ボタンが縦に並ぶ
- 「🎛️ 表示」クリックでパネル展開（事業者5＋要素3のチップ）
- 事業者チップ（例: JR）OFF → JR路線・駅が非表示
- 要素チップ（駅）OFF → 駅マーカーが非表示、（振替）OFF → 点線が非表示
- バスチップOFF → バス路線・停留所が非表示（旧 BusToggle 相当）
- 凡例の路線個別切替は従来通り動作
（`Ctrl+C` で終了）

- [ ] **Step 6: Commit**

```bash
git add -A src/App.tsx src/ui/BusToggle.tsx src/index.css
git commit -m "feat(display): App に useDisplayState/DisplayPanel を導入し BusToggle を廃止"
```

---

### Task 10: README 更新

機能説明に表示設定パネルを追記する。

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 機能一覧に表示設定パネルを追記**

`README.md` の特徴リストに追加（都バスの項の後など）:
```markdown
- **表示設定パネル**: 「🎛️ 表示」から事業者カテゴリ（JR/東京メトロ/都営/私鉄/その他）と地図要素（駅/振替ルート/都バス）の表示ON/OFFを切り替えられます。カテゴリを絞ると路線と駅が一括で切り替わります。
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs(display): 表示設定パネルの説明を追記"
```

---

### Task 11: 全体確認（型・テスト・カバレッジ・lint・build）

**Files:**（変更なし、検証のみ）

- [ ] **Step 1: 型チェック**

Run: `npm run typecheck`
Expected: エラーなし

- [ ] **Step 2: テスト全実行**

Run: `npm run test:run`
Expected: 全テスト PASS

- [ ] **Step 3: カバレッジ（80% 閾値維持）**

Run: `npm run test:coverage`
Expected: 全テスト PASS。`src/domain/**`（`displayVisibility.ts` 含む）/`src/geojson/**`/`src/data/**`/`src/map/filters.ts` が lines/functions/branches/statements とも 80% 以上。

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: エラーなし

- [ ] **Step 5: 本番ビルド**

Run: `npm run build`
Expected: ビルド成功。`dist/` 生成。

- [ ] **Step 6: 手動動作確認**

Run: `npm run preview`
Expected:
- 初期ロードは全路線・全要素表示
- 「🎛️ 表示」パネルで各事業者/要素をOFFにすると即座に反映
- カテゴリOFF時は該当路線＋駅が一括非表示（個別ONでも非表示）
- 山手線運休モードは表示設定と独立して動作
- 路線個別切替（凡例）は継続動作
（`Ctrl+C` で終了）

- [ ] **Step 7: 失敗時は該当 Task に戻って修正（本 Task ではコミットしない）**

全 Step が PASS すれば計画完了。

---

## 完了条件（設計書準拠）

- [ ] 23路線すべてに `category`（jr/metro/toei/private/other）が設定され zod 検証される
- [ ] 「表示設定」パネルで事業者5カテゴリと要素3レイヤー（駅/振替/バス）をON/OFFできる
- [ ] カテゴリOFF時は該当路線（と駅）が非表示（個別ONでも非表示＝カテゴリ優先）
- [ ] 要素OFF時（駅/振替）は該当レイヤーが非表示（新規制御）
- [ ] バスはパネル内「要素: バス」で制御（BusToggle 廃止）
- [ ] 山手線運休モードは独立して動作（影響なし）
- [ ] 路線個別切替（Legend）は継続動作
- [ ] `npm run typecheck` / `test:coverage`(80%+) / `lint` / `build` がすべて PASS

## 設計との差分（実装で確定したこと）

- **Legend は変更不要**: App 側で `display.state.hiddenLineIds` と `isLayerVisible('bus', state)` を展開して既存 props に渡すため、Legend の Props/実装はそのまま（設計書の「Legend.tsx 変更」は不要と確定）。
- **Reducer は domain 層に配置**: `displayVisibility.ts` に純粋関数として置きテスト容易化。`useDisplayState.ts` は thin ラッパ。
- **`buildLineFilter` は常に `['all', ...]` を返す**: 単一条件でも `['all', match式]` とし、`noUncheckedIndexedAccess` 非対応環境でも安全（tsconfig は OFF だが将来を見据え）。
