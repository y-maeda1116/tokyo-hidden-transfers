// scripts/rail-coords/overpassClient.ts
import type { OverpassResponse } from './parseOverpass.ts'

/** リトライ対象外の致命的エラー（4xx 等）。catch ブロックで即座に伝播させる。 */
class FatalOverpassError extends Error {}

const DEFAULT_ENDPOINT = 'https://overpass-api.de/api/interpreter'
const FALLBACK_ENDPOINT = 'https://overpass.private.coffee/api/interpreter'

// OSM/Overpass の運用方針でアプリ識別用 User-Agent が必須（デフォルト UA だと 406 を返す）。
const USER_AGENT = 'tokyo-hidden-transfers/0.1 (https://github.com/y-maeda1116/tokyo-hidden-transfers)'

export interface QueryOverpassOptions {
  /** fetch 実装（省略時は globalThis.fetch）。テストでモックを注入する。 */
  readonly fetchImpl?: typeof fetch
  /** エンドポイント（省略時は環境変数 OVERPASS_ENDPOINT、さらに省略時は既定＋フォールバック）。 */
  readonly endpoint?: string
  /** 最大リトライ回数（既定 4）。 */
  readonly maxRetries?: number
  /** sleep 実装（省略時は setTimeout）。テストで即時解決させる。 */
  readonly sleepImpl?: (ms: number) => Promise<void>
}

/** エンドポイントとクエリから GET リクエスト URL を生成する（純粋関数・テスト用）。 */
export function buildRequestUrl(endpoint: string, query: string): string {
  return `${endpoint}?data=${encodeURIComponent(query)}`
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Overpass API に GET（?data=）でクエリを送信し JSON レスポンスを返す。
 * POST + form だと overpass-api.de が 406 を返すため GET を使用。
 * 429（レート制限）/5xx は指数バックオフ（1s, 2s, 4s, 8s, 16s 上限）でリトライし、
 * リトライ後半はフォールバックエンドポイントに切替える。
 * OVERPASS_ENDPOINT で固定エンドポイントを強制できる。
 */
export async function queryOverpass(
  query: string,
  options: QueryOverpassOptions = {},
): Promise<OverpassResponse> {
  const fetchImpl = options.fetchImpl ?? fetch
  const maxRetries = options.maxRetries ?? 4
  const sleep = options.sleepImpl ?? defaultSleep
  const fixedEndpoint = options.endpoint ?? process.env.OVERPASS_ENDPOINT

  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // 固定指定がなければ、リトライ後半でフォールバック endpoint に切替え
    const endpoint =
      fixedEndpoint ??
      (attempt >= Math.ceil(maxRetries / 2) ? FALLBACK_ENDPOINT : DEFAULT_ENDPOINT)
    const url = buildRequestUrl(endpoint, query)

    try {
      const res = await fetchImpl(url, { headers: { 'User-Agent': USER_AGENT } })
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`Overpass ${res.status}（リトライ対象）`)
      }
      if (!res.ok) {
        throw new FatalOverpassError(`Overpass ${res.status}: ${await res.text()}`)
      }
      return (await res.json()) as OverpassResponse
    } catch (error) {
      if (error instanceof FatalOverpassError) throw error
      lastError = error
      if (attempt === maxRetries) break
      const backoff = Math.min(1000 * 2 ** attempt, 16000)
      await sleep(backoff)
    }
  }
  throw new Error(
    `Overpass API の取得に失敗（リトライ ${maxRetries} 回）: ${String(lastError)}`,
  )
}
