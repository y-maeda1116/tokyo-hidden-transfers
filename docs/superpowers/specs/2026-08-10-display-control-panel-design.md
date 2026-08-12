# 表示制御パネル（事業者カテゴリ + 地図要素レイヤー）— 設計

**Date:** 2026-08-10
**Status:** Approved (brainstorming)
**Branch:** `feat/display-control-panel`（main から切る）

## Goal

地図の表示対象を「事業者カテゴリ」（JR/東京メトロ/都営/私鉄/その他）と「地図要素レイヤー」（駅/振替/バス）の両軸で選択できるようにする。現在は「路線個別ON/OFF」「運休モード」「都バスON/OFF」の状態が `App` に散在しており、新たな選択肢を増やしにくい。これを1つの Reducer に集約し、折りたたみ式の「表示設定」パネルから操作する。拡張性を主眼とする（「選択肢を増やせるように」が要件）。

## Architecture（承認済みアプローチ A: 統合パネル）

表示ON/OFF系の状態を `DisplayState` に一元管理し、`useReducer` で運用。UIは折りたたみ式の「表示設定」パネル（`DisplayPanel`）に集約。路線個別切替は既存の `Legend` に残し、カテゴリ=一括／個別=微調整の2層とする。山手線運休モード（`suspensionMode`）は「強調表示」の別概念のため、独立した state として維持（本仕組みに統合しない）。

## データ層

### `Line.category` フィールド追加

`LineSchema` に事業者カテゴリを追加する。値は閉じた enum。

```ts
// src/domain/schemas.ts
export const LineCategorySchema = z.enum(['jr', 'metro', 'toei', 'private', 'other'])
export type LineCategory = z.infer<typeof LineCategorySchema>

export const LineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  stations: z.array(StationSchema).min(2),
  mode: z.enum(['rail', 'bus', 'tram']).optional(),
  category: LineCategorySchema,   // ★追加（必須）
  closed: z.boolean().optional(),
})
```

23路線への割当:

| category | 路線 |
|----------|------|
| `jr` | 山手線、中央総武 |
| `metro` | 千代田、副都心、銀座、半蔵門、日比谷、丸ノ内、南北、東西、有楽町 |
| `toei` | 浅草、大江戸、三田、新宿、都電荒川、日暮里舎人ライナー |
| `private` | 京急、京成、小田急、西武新宿、東横 |
| `other` | つくばエクスプレス |

計: jr2 + metro9 + toei6 + private5 + other1 = 23

## ドメイン層（純粋関数・coverage 対象）

### `src/domain/displayVisibility.ts`（新規）

表示判定の純粋関数。状態と対象から可視か否かを返す（イミュータブル・副作用なし）。

```ts
export type Category = LineCategory   // 'jr' | 'metro' | 'toei' | 'private' | 'other'
export type LayerKey = 'stations' | 'transfers' | 'bus'

export interface DisplayState {
  readonly categoryHidden: ReadonlySet<Category>
  readonly hiddenLineIds: ReadonlySet<string>
  readonly layerHidden: ReadonlySet<LayerKey>
}

/** 路線が表示対象か（個別OFF または カテゴリOFF なら非表示＝AND結合・カテゴリ優先）。 */
export function isLineVisible(line: { id: string; category: Category }, state: DisplayState): boolean {
  return !state.hiddenLineIds.has(line.id) && !state.categoryHidden.has(line.category)
}

/** 地図要素レイヤーが表示対象か。 */
export function isLayerVisible(layer: LayerKey, state: DisplayState): boolean {
  return !state.layerHidden.has(layer)
}
```

`isLineVisible` は「カテゴリ優先」: カテゴリOFFなら個別ONでも非表示（承認済み a）。

### `src/map/filters.ts` 拡張

`buildHiddenLineFilter` を拡張し、カテゴリ込みの MapLibre filter 式を生成する。路線feature（`properties.id`/`properties.category`）と駅feature（`properties.lineId`/`properties.category`）の両方に使えるよう `property` を指定。

```ts
export function buildLineFilter(
  hiddenLineIds: ReadonlySet<string>,
  categoryHidden: ReadonlySet<Category>,
  property: { id: 'id'; category: 'category' } | { lineId: 'lineId'; category: 'category' },
): FilterSpecification {
  const idProp = 'id' in property ? 'id' : 'lineId'
  const hasId = hiddenLineIds.size > 0
  const hasCat = categoryHidden.size > 0
  if (!hasId && !hasCat) return ['all']
  // 「id が hidden でない AND category が hidden でない」= 表示
  // match 式: hiddenId → false、hiddenCategory → false、それ以外 → true
  const conditions: FilterSpecification[] = []
  if (hasId) conditions.push(['match', ['get', idProp], [...hiddenLineIds], false, true])
  if (hasCat) conditions.push(['match', ['get', 'category'], [...categoryHidden], false, true])
  return conditions.length === 1 ? conditions[0] : ['all', ...conditions]
}
```

既存 `buildHiddenLineFilter` は `buildLineFilter` へ置換（後方互換のラッパは置かず、呼出元を更新）。

## 状態管理

### `src/map/useDisplayState.ts`（新規）

`DisplayState` と操作を提供するフック。Reducer パターン（イミュータブル更新・`new Set` 生成）。

```ts
type Action =
  | { type: 'toggleCategory'; category: Category }
  | { type: 'toggleLine'; lineId: string }
  | { type: 'toggleLayer'; layer: LayerKey }

export function useDisplayState(): {
  state: DisplayState
  toggleCategory: (c: Category) => void
  toggleLine: (id: string) => void
  toggleLayer: (l: LayerKey) => void
}
```

`toggleLine` は既存 `toggleLine`（App 内）と同等のロジックを Reducer へ移譲。初期状態は「すべて表示」（全集合 空）。

## UI

### `src/ui/DisplayPanel.tsx`（新規）

折りたたみ式「表示設定」パネル。開閉 state はローカル（`useState`）。左上の「🎛️ 表示」ボタンで切替。

- **事業者セクション**: JR / メトロ / 都営 / 私鉄 / その他（各トグル・`toggleCategory`）
- **要素セクション**: 駅 / 振替 / バス（各トグル・`toggleLayer`）
- 各項目は `aria-pressed` で状態を示す（アクセシビリティ）

### 既存UIの扱い

- **`BusToggle`（🚌 都バス）→ 廃止**。パネル内「要素: バス」に統合（承認済み b）。
- **`SuspensionToggle`（運休）→ 独立維持**。左上に残す。
- **`Legend`（路線個別）→ 現状維持**。`hiddenLineIds` を使い続ける（Reducer 経由に切替）。

### 配置

- 左上: `SuspensionToggle`（既存）、その下に `DisplayPanel` の開閉ボタン「🎛️ 表示」。
- パネル展開時: `SuspensionToggle` の下に重ねて表示（`position: absolute`・z-index 調整）。

## MapContainer 統合

`MapContainer` の Props を変更:

```ts
interface Props {
  lines: readonly Line[]
  transfers: readonly Transfer[]
  stationsById: ReadonlyMap<string, Station>
  displayState: DisplayState          // ★ hiddenLineIds/busVisible → 置換
  suspensionMode: boolean
  focusTarget: { stationId: string } | null
  onFocusConsumed: () => void
}
```

適用:
- **路線・駅フィルタ**: `buildLineFilter(state.hiddenLineIds, state.categoryHidden, ...)` を `lines-layer`/`stations-layer` へ `setFilter`。
- **駅レイヤー**: `visibility` = `isLayerVisible('stations', state) ? 'visible' : 'none'`（新規制御）。
- **振替レイヤー**: `visibility` = `isLayerVisible('transfers', state) ? 'visible' : 'none'`（新規制御）。
- **バス**: `useBusLayers` へ `busVisible = isLayerVisible('bus', state)` を渡す（既存ロジック踏襲）。

### `builders.ts`

路線featureと駅featureに `category` プロパティを付与:
- `buildLinesCollection`: `properties.category = line.category`
- `buildStationsCollection`: 駅の所属路線の `category` を解決して付与（`lineId → category` の Map を構築）

## ファイル構成

**Create:**
- `src/domain/displayVisibility.ts` + `.test.ts`
- `src/map/useDisplayState.ts`
- `src/ui/DisplayPanel.tsx`

**Modify:**
- `src/domain/schemas.ts`（`LineCategorySchema`/`category` 追加）
- `src/domain/types.ts`（`LineCategory` エクスポート、必要に応じ）
- `src/data/lines/*.ts`（23路線に `category` 追加）
- `src/data/index.test.ts`（category 検証が含まれることを確認）
- `src/map/filters.ts`（`buildLineFilter` へ拡張）+ `.test.ts`
- `src/geojson/builders.ts`（category 付与）+ `.test.ts`
- `src/map/MapContainer.tsx`（Props 変更・フィルタ/visibility 適用）
- `src/App.tsx`（`useDisplayState` 導入・`DisplayPanel` 配置・`BusToggle` 削除）
- `src/index.css`（`.display-panel` 系スタイル）
- `src/ui/Legend.tsx`（`hiddenLineIds` → `displayState` 受け取りに変更、`busVisible` 連動は `isLayerVisible('bus')` へ）
- `README.md`（機能説明追記）

**Delete:**
- `src/ui/BusToggle.tsx`

## テスト方針（coverage 対象: `src/domain/**` / `src/geojson/**` / `src/data/**` / `src/map/filters.ts`）

- `displayVisibility.test.ts`: `isLineVisible`（個別OFF/カテゴリOFF/両方/両方OFF）、`isLayerVisible` の判定
- `filters.test.ts`: `buildLineFilter` のフィルタ式生成（空/IDのみ/カテゴリのみ/両方/property切替）
- `builders.test.ts`: 路線・駅 feature に `category` が付与されること
- `index.test.ts`: 23路線すべてに `category` が設定されていること（既存路線数テストの拡張）
- `useDisplayState`: Reducer の状態遷移（トグルON/OFF・Set のイミュータブル更新）

閾値: lines/functions/branches/statements とも 80% 维持。

## 完了条件

- [ ] 23路線すべてに `category`（jr/metro/toei/private/other）が設定され zod 検証される
- [ ] 「表示設定」パネルで事業者5カテゴリと要素3レイヤー（駅/振替/バス）をON/OFFできる
- [ ] カテゴリOFF時は該当路線（と駅）が非表示（個別ONでも非表示＝カテゴリ優先）
- [ ] 要素OFF時（駅/振替）は該当レイヤーが非表示（新規制御）
- [ ] バスはパネル内「要素: バス」で制御（BusToggle 廃止）
- [ ] 山手線運休モードは独立して動作（影響なし）
- [ ] 路線個別切替（Legend）は継続動作
- [ ] `npm run typecheck` / `test:coverage`(80%+) / `lint` / `build` がすべて PASS

## 設計上の決定事項（記録）

- **カテゴリ優先**（a）: カテゴリOFF時は個別ONでも非表示。直感的で実装も単純（AND結合）。
- **BusToggle 統合**（b）: 左上のトグルを減らし、表示制御をパネルに一本化。バス切替はパネル内へ。
- **suspensionMode 独立**: 強調表示（paint 変更）は表示ON/OFFと直交するため統合しない。
- **`buildHiddenLineFilter` 置換**: 後方互換ラッパを置かず呼出元を更新（デッドコード回避）。
