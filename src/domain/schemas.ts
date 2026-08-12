import { z } from 'zod'

/**
 * 駅: 地図上の1点（Point）を表す。
 * lon/lat は WGS84（経度/緯度）。GeoJSON は [lon, lat] 順で扱う。
 * mode は交通手段（rail/bus/tram）。省略時は rail 扱い（描画で mode 未設定を rail と解釈）。
 */
export const StationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  lineId: z.string().min(1),
  lon: z.number(),
  lat: z.number(),
  mode: z.enum(['rail', 'bus', 'tram']).optional(),
})

/**
 * 路線の事業者カテゴリ（表示制御パネルのグループ選択用）。
 * jr: JR / metro: 東京メトロ / toei: 都営交通 / private: 私鉄 / other: 第三セクター等
 */
export const LineCategorySchema = z.enum(['jr', 'metro', 'toei', 'private', 'other'])
export type LineCategory = z.infer<typeof LineCategorySchema>

/**
 * 路線: 駅を順に結ぶ折れ線（LineString）。
 * LineString の要件（2点以上）を保証するため stations は2駅以上必須。
 * color は #RRGGBB 6桁のみ許可。
 * mode は交通手段（rail/bus/tram）。省略時は rail 扱い。
 *   bus は「鉄道で直接繋がらない2点を結ぶ系統」に限定して追加する（編集ルール）。
 */
export const LineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  stations: z.array(StationSchema).min(2),
  mode: z.enum(['rail', 'bus', 'tram']).optional(),
  category: LineCategorySchema,
  // 環状路線（山手線など）。true のとき LineString の始点を末尾に追加して線を閉じる。
  closed: z.boolean().optional(),
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
