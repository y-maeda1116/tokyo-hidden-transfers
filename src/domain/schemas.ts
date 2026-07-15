import { z } from 'zod'

/**
 * 駅: 地図上の1点（Point）を表す。
 * lon/lat は WGS84（経度/緯度）。GeoJSON は [lon, lat] 順で扱う。
 */
export const StationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  lineId: z.string().min(1),
  lon: z.number(),
  lat: z.number(),
})

/**
 * 路線: 駅を順に結ぶ折れ線（LineString）。
 * LineString の要件（2点以上）を保証するため stations は2駅以上必須。
 * color は #RRGGBB 6桁のみ許可。
 */
export const LineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  stations: z.array(StationSchema).min(2),
})

/**
 * 非公式乗換: 徒歩連絡が可能な2駅間の関係。
 * walkMinutes は1以上の整数（徒歩時間）。
 */
export const TransferSchema = z.object({
  id: z.string().min(1),
  fromStationId: z.string().min(1),
  toStationId: z.string().min(1),
  walkMinutes: z.number().int().positive(),
  note: z.string().optional(),
})
