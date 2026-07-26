import type { FilterSpecification } from 'maplibre-gl'

/**
 * 非表示にする路線IDの集合から、MapLibre レイヤー用フィルタ式を構築する（純粋関数）。
 * - 空集合のときは ['all']（条件なし＝全表示）。
 * - 非空のときは match 式で、hiddenLineIds に含まれる feature を false（非表示）にする。
 *
 * property='id' は路線レイヤー（feature.properties.id = 路線ID）、
 * property='lineId' は駅レイヤー（feature.properties.lineId = 所属路線ID）用。
 */
export function buildHiddenLineFilter(
  hiddenLineIds: ReadonlySet<string>,
  property: 'id' | 'lineId' = 'id',
): FilterSpecification {
  if (hiddenLineIds.size === 0) return ['all']
  return ['match', ['get', property], [...hiddenLineIds], false, true]
}
