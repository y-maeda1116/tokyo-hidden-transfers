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
