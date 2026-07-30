import type { Feature, FeatureCollection } from 'geojson'
import type { Line, Station, Transfer } from '../domain/types.ts'
import { FeatureCollectionSchema } from '../domain/geojsonSchema.ts'

/** 駅を GeoJSON の Point Feature に変換する（座標は [lon, lat] 順）。 */
export function buildStationPoint(station: Station, color: string): Feature {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [station.lon, station.lat] },
    properties: {
      kind: 'station',
      id: station.id,
      name: station.name,
      lineId: station.lineId,
      color,
    },
  }
}

/** 路線の駅順に LineString Feature を構築する。closed（環状路線）は始点に戻って閉じる。 */
export function buildLineFeature(line: Line): Feature {
  const base = line.stations.map((s): [number, number] => [s.lon, s.lat])
  // 環状路線は始点を末尾に追加して線を閉じる（山手線など）
  const coordinates = line.closed && base.length > 0 ? [...base, base[0]] : base
  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates },
    properties: {
      kind: 'line',
      id: line.id,
      name: line.name,
      color: line.color,
    },
  }
}

/**
 * 山手線運休時の振替（迂回）ルートか。
 * transfers.ts で id を 'detour-' 始まりにする規約で識別する（純粋関数）。
 */
export function isDetourTransfer(transfer: Transfer): boolean {
  return transfer.id.startsWith('detour-')
}

/** 非公式乗換の2駅を結ぶ LineString Feature を構築する。 */
export function buildTransferLineFeature(
  transfer: Transfer,
  from: Station,
  to: Station,
): Feature {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [from.lon, from.lat],
        [to.lon, to.lat],
      ],
    },
    properties: {
      kind: 'transfer',
      id: transfer.id,
      fromStationId: transfer.fromStationId,
      toStationId: transfer.toStationId,
      walkMinutes: transfer.walkMinutes,
      note: transfer.note,
      isDetour: isDetourTransfer(transfer),
    },
  }
}

/** Feature 配列を検証付き FeatureCollection にまとめる（イミュータブル）。 */
function toCollection(features: Feature[]): FeatureCollection {
  const fc: FeatureCollection = { type: 'FeatureCollection', features }
  FeatureCollectionSchema.parse(fc)
  return fc
}

/** 全路線の LineString FeatureCollection を生成する。 */
export function buildLinesCollection(
  lines: readonly Line[],
): FeatureCollection {
  return toCollection(lines.map(buildLineFeature))
}

/** 全路線の駅を Point FeatureCollection として生成する（路線色を付与）。 */
export function buildStationsCollection(
  lines: readonly Line[],
): FeatureCollection {
  const features = lines.flatMap((line) =>
    line.stations.map((station) => buildStationPoint(station, line.color)),
  )
  return toCollection(features)
}

/** 非公式乗換の LineString FeatureCollection を生成する（駅参照を解決）。 */
export function buildTransfersCollection(
  transfers: readonly Transfer[],
  stationsById: ReadonlyMap<string, Station>,
): FeatureCollection {
  const features = transfers.map((transfer) => {
    const from = resolveStation(
      stationsById,
      transfer.fromStationId,
      transfer.id,
      'from',
    )
    const to = resolveStation(
      stationsById,
      transfer.toStationId,
      transfer.id,
      'to',
    )
    return buildTransferLineFeature(transfer, from, to)
  })
  return toCollection(features)
}

function resolveStation(
  stationsById: ReadonlyMap<string, Station>,
  stationId: string,
  transferId: string,
  direction: 'from' | 'to',
): Station {
  const station = stationsById.get(stationId)
  if (!station) {
    throw new Error(
      `非公式乗換 '${transferId}' の ${direction}StationId '${stationId}' に対応する駅が見つかりません。データ定義を確認してください。`,
    )
  }
  return station
}
