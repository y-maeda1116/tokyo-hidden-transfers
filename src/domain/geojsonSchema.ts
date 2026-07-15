import { z } from 'zod'

// GeoJSON サブセット（本アプリが使う Point / LineString のみ）を実行時検証する。
const Position = z.tuple([z.number(), z.number()])

const PointGeometry = z.object({
  type: z.literal('Point'),
  coordinates: Position,
})

const LineStringGeometry = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(Position).min(2),
})

const Geometry = z.discriminatedUnion('type', [
  PointGeometry,
  LineStringGeometry,
])

const Feature = z.object({
  type: z.literal('Feature'),
  geometry: Geometry,
  properties: z.record(z.string(), z.unknown()),
})

/** 生成した FeatureCollection が正しい構造か最終検証する。 */
export const FeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(Feature),
})
