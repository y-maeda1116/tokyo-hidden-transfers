import { LineSchema, TransferSchema } from '../domain/schemas.ts'
import type { Line, Station, Transfer } from '../domain/types.ts'
import { asakusaLine } from './lines/asakusaLine.ts'
import { chiyodaLine } from './lines/chiyodaLine.ts'
import { chuoSobuLocalLine } from './lines/chuoSobuLocalLine.ts'
import { fukutoshinLine } from './lines/fukutoshinLine.ts'
import { ginzaLine } from './lines/ginzaLine.ts'
import { keikyuLine } from './lines/keikyuLine.ts'
import { keiseiLine } from './lines/keiseiLine.ts'
import { hanzomonLine } from './lines/hanzomonLine.ts'
import { hibiyaLine } from './lines/hibiyaLine.ts'
import { marunouchiLine } from './lines/marunouchiLine.ts'
import { mitaLine } from './lines/mitaLine.ts'
import { nambokuLine } from './lines/nambokuLine.ts'
import { nipporiToneriLinerLine } from './lines/nipporiToneriLinerLine.ts'
import { odakyuLine } from './lines/odakyuLine.ts'
import { oedoLine } from './lines/oedoLine.ts'
import { seibuShinjukuLine } from './lines/seibuShinjukuLine.ts'
import { shinjukuLine } from './lines/shinjukuLine.ts'
import { todenArakawaLine } from './lines/todenArakawaLine.ts'
import { toyokoLine } from './lines/toyokoLine.ts'
import { tozaiLine } from './lines/tozaiLine.ts'
import { tsukubaExpress } from './lines/tsukubaExpress.ts'
import { yamanoteLine } from './lines/yamanoteLine.ts'
import { yurakuchoLine } from './lines/yurakuchoLine.ts'
import { transfers } from './transfers.ts'

// 起動時に zod で検証し、不正データなら即座に失敗させる（フェイルファスト）。
const validatedLines: Line[] = LineSchema.array().parse([
  asakusaLine,
  chiyodaLine,
  fukutoshinLine,
  oedoLine,
  mitaLine,
  nambokuLine,
  ginzaLine,
  hanzomonLine,
  hibiyaLine,
  marunouchiLine,
  shinjukuLine,
  tozaiLine,
  tsukubaExpress,
  yamanoteLine,
  yurakuchoLine,
  chuoSobuLocalLine,
  nipporiToneriLinerLine,
  todenArakawaLine,
  keikyuLine,
  keiseiLine,
  odakyuLine,
  seibuShinjukuLine,
  toyokoLine,
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
