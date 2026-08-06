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
