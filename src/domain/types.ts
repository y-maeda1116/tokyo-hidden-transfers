import type { z } from 'zod'
import type { LineSchema, StationSchema, TransferSchema } from './schemas.ts'

/** 型と実行時検証の単一ソース化: zod スキーマから型を導出する。 */
export type Station = z.infer<typeof StationSchema>
export type Line = z.infer<typeof LineSchema>
export type Transfer = z.infer<typeof TransferSchema>
