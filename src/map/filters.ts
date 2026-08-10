import type { FilterSpecification } from 'maplibre-gl'
import type { Category } from '../domain/displayVisibility.ts'

/**
 * 非表示路線ID集合と非表示カテゴリ集合から、MapLibre レイヤー用フィルタ式を構築する（純粋関数）。
 * - 両方空のときは ['all']（条件なし＝全表示）。
 * - いずれか非空のときは「id が hidden でない AND category が hidden でない」を表す
 *   match 式を ['all', ...] で結合する（AND結合・カテゴリ優先）。
 *
 * idProperty='id' は路線レイヤー、'lineId' は駅レイヤー用。
 * category は路線・駅どちらも feature.properties.category を参照する。
 */
export function buildLineFilter(
  hiddenLineIds: ReadonlySet<string>,
  categoryHidden: ReadonlySet<Category>,
  idProperty: 'id' | 'lineId',
): FilterSpecification {
  const hasId = hiddenLineIds.size > 0
  const hasCat = categoryHidden.size > 0
  if (!hasId && !hasCat) return ['all']
  if (hasId && hasCat) {
    return [
      'all',
      ['match', ['get', idProperty], [...hiddenLineIds], false, true],
      ['match', ['get', 'category'], [...categoryHidden], false, true],
    ]
  }
  if (hasId) {
    return ['all', ['match', ['get', idProperty], [...hiddenLineIds], false, true]]
  }
  return ['all', ['match', ['get', 'category'], [...categoryHidden], false, true]]
}
