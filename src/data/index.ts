import { LineSchema, TransferSchema } from '../domain/schemas.ts'
import type { Line, Station, Transfer } from '../domain/types.ts'
import { asakusaLine } from './lines/asakusaLine.ts'
import { ginzaLine } from './lines/ginzaLine.ts'
import { oedoLine } from './lines/oedoLine.ts'
import { tsukubaExpress } from './lines/tsukubaExpress.ts'
import { transfers } from './transfers.ts'

// 起動時に zod で検証し、不正データなら即座に失敗させる（フェイルファスト）。
const validatedLines: Line[] = LineSchema.array().parse([
  asakusaLine,
  oedoLine,
  ginzaLine,
  tsukubaExpress,
])
const validatedTransfers: Transfer[] = TransferSchema.array().parse(transfers)

/** 全路線（イミュータブル）。 */
export const lines: readonly Line[] = Object.freeze(validatedLines)

/** 全非公式乗換（イミュータブル）。 */
export const allTransfers: readonly Transfer[] = Object.freeze(validatedTransfers)

/** 駅ID → 駅 のルックアップ（乗換の参照解決用）。ReadonlyMap で不変参照を保証。 */
export const stationsById: ReadonlyMap<string, Station> = new Map(
  lines
    .flatMap((line) => line.stations)
    .map((station) => [station.id, station] as const),
)
