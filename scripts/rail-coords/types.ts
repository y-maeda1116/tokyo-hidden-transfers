// scripts/rail-coords/types.ts

/** 既存の路線ファイルに定義された駅（座標更新の対象）。 */
export interface ExistingStation {
  readonly id: string
  readonly name: string
  readonly lat: number
  readonly lon: number
}

/**
 * OSM から取得した駅候補。route relation の role=stop ノード、
 * way メンバーの中心点、railway=station フォールバックノードのいずれか。
 */
export interface OsmStopCandidate {
  readonly name: string
  readonly lat: number
  readonly lon: number
  /** 取得元（マッチ時の優先度判定と出所記録に使用）。 */
  readonly source: CoordSource
  /** 駅ナンバリング（OSM の railway:ref）。同名駅の衝突回避用。 */
  readonly ref?: string
}

/** マッチした座標の取得元。出所の記録と品質確認に使う。 */
export type CoordSource = 'relation-stop' | 'relation-way' | 'station-fallback'

/** 既存駅 → OSM 座標のマッチ結果。 */
export interface StopMatch {
  readonly stationId: string
  readonly name: string
  readonly newLat: number
  readonly newLon: number
  readonly source: CoordSource
  /** マッチ判定に使った OSM 側の駅名（正規化前）。 */
  readonly matchedName: string
}

/** マッチしなかった既存駅。現状値を保持して警告する。 */
export interface UnmatchedStation {
  readonly stationId: string
  readonly name: string
  readonly currentLat: number
  readonly currentLon: number
}

/** matchStops の戻り値。 */
export interface MatchResult {
  readonly matches: readonly StopMatch[]
  readonly unmatched: readonly UnmatchedStation[]
}

/** 1 駅あたりの座標差分（ドライランレポート用）。 */
export interface CoordDiff {
  readonly stationId: string
  readonly name: string
  readonly source: CoordSource
  readonly oldLat: number
  readonly oldLon: number
  readonly newLat: number
  readonly newLon: number
}

/** バウンディングボックス（南, 西, 北, 東）。巨大 relation の取得範囲を絞るために使用。 */
export interface Bbox {
  readonly south: number
  readonly west: number
  readonly north: number
  readonly east: number
}

/** 路線と OSM route relation id の対応。build-rail-coords.ts の LINE_RELATIONS が参照。 */
export interface LineRelationConfig {
  readonly lineId: string
  readonly relationIds: readonly number[]
  /** 更新対象の路線ファイルパス（src/data/lines/ からの相対）。 */
  readonly filePath: string
  /** 巨大 relation（全線を含む私鉄等）で取得範囲を絞るバウンディングボックス。 */
  readonly bbox?: Bbox
  readonly note?: string
}
