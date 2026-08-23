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
import { tobuSkytreeLine } from './lines/tobuSkytreeLine.ts'
import { tobuTojoLine } from './lines/tobuTojoLine.ts'
import { todenArakawaLine } from './lines/todenArakawaLine.ts'
import { toyokoLine } from './lines/toyokoLine.ts'
import { tozaiLine } from './lines/tozaiLine.ts'
import { tsukubaExpress } from './lines/tsukubaExpress.ts'
import { yamanoteLine } from './lines/yamanoteLine.ts'
import { yurakuchoLine } from './lines/yurakuchoLine.ts'
// --- JR在来線（OSM route relation の停車位置から生成・2026-08 追加） ---
import { keihinTohokuLine } from './lines/keihinTohokuLine.ts'
import { chuoRapidLine } from './lines/chuoRapidLine.ts'
import { saikyoLine } from './lines/saikyoLine.ts'
import { tokaidoLine } from './lines/tokaidoLine.ts'
import { utsunomiyaLine } from './lines/utsunomiyaLine.ts'
import { takasakiLine } from './lines/takasakiLine.ts'
import { jobanLine } from './lines/jobanLine.ts'
import { jobanLocalLine } from './lines/jobanLocalLine.ts'
import { sobuRapidLine } from './lines/sobuRapidLine.ts'
import { keiyoLine } from './lines/keiyoLine.ts'
import { musashinoLine } from './lines/musashinoLine.ts'
import { yokohamaLine } from './lines/yokohamaLine.ts'
import { nambuLine } from './lines/nambuLine.ts'
import { omeLine } from './lines/omeLine.ts'
import { itsukaichiLine } from './lines/itsukaichiLine.ts'
// --- モノレール・第三セクター（同上） ---
import { tokyoMonorailLine } from './lines/tokyoMonorailLine.ts'
import { rinkaiLine } from './lines/rinkaiLine.ts'
import { tamaMonorailLine } from './lines/tamaMonorailLine.ts'
// --- 私鉄（同上） ---
import { keikyuAirportLine } from './lines/keikyuAirportLine.ts'
import { keioLine } from './lines/keioLine.ts'
import { keioSagamiharaLine } from './lines/keioSagamiharaLine.ts'
import { keioTakaoLine } from './lines/keioTakaoLine.ts'
import { inokashiraLine } from './lines/inokashiraLine.ts'
import { tokyuMeguroLine } from './lines/tokyuMeguroLine.ts'
import { tokyuOimachiLine } from './lines/tokyuOimachiLine.ts'
import { tokyuIkegamiLine } from './lines/tokyuIkegamiLine.ts'
import { tokyuTamagawaLine } from './lines/tokyuTamagawaLine.ts'
import { tokyuSetagayaLine } from './lines/tokyuSetagayaLine.ts'
import { tokyuDenentoshiLine } from './lines/tokyuDenentoshiLine.ts'
import { seibuIkebukuroLine } from './lines/seibuIkebukuroLine.ts'
import { seibuHaijimaLine } from './lines/seibuHaijimaLine.ts'
import { seibuKokubunjiLine } from './lines/seibuKokubunjiLine.ts'
import { seibuTamakoLine } from './lines/seibuTamakoLine.ts'
import { seibuTamagawaLine } from './lines/seibuTamagawaLine.ts'
import { seibuSeibuenLine } from './lines/seibuSeibuenLine.ts'
import { odakyuTamaLine } from './lines/odakyuTamaLine.ts'
import { tobuTaishiLine } from './lines/tobuTaishiLine.ts'
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
  tobuSkytreeLine,
  tobuTojoLine,
  // --- JR在来線 ---
  keihinTohokuLine,
  chuoRapidLine,
  saikyoLine,
  tokaidoLine,
  utsunomiyaLine,
  takasakiLine,
  jobanLine,
  jobanLocalLine,
  sobuRapidLine,
  keiyoLine,
  musashinoLine,
  yokohamaLine,
  nambuLine,
  omeLine,
  itsukaichiLine,
  // --- モノレール・第三セクター ---
  tokyoMonorailLine,
  rinkaiLine,
  tamaMonorailLine,
  // --- 私鉄 ---
  keikyuAirportLine,
  keioLine,
  keioSagamiharaLine,
  keioTakaoLine,
  inokashiraLine,
  tokyuMeguroLine,
  tokyuOimachiLine,
  tokyuIkegamiLine,
  tokyuTamagawaLine,
  tokyuSetagayaLine,
  tokyuDenentoshiLine,
  seibuIkebukuroLine,
  seibuHaijimaLine,
  seibuKokubunjiLine,
  seibuTamakoLine,
  seibuTamagawaLine,
  seibuSeibuenLine,
  odakyuTamaLine,
  tobuTaishiLine,
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
