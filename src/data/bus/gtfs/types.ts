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
