export type DisplayMode = 'compact' | 'full'

const STORAGE_KEY = 'display-mode'

/** 窄画面（スマホ幅）を判定するメディアクエリ。フック本体は次タスクで実装。 */
export const COMPACT_MEDIA_QUERY = '(max-width: 640px)'

/**
 * 表示モードの判定（純粋関数）。
 * 手動上書き（stored）があれば優先し、なければ画面幅の自動判定に従う。
 */
export function resolveDisplayMode(
  stored: DisplayMode | null,
  mediaMatches: boolean,
): DisplayMode {
  if (stored === 'compact' || stored === 'full') {
    return stored
  }
  return mediaMatches ? 'compact' : 'full'
}

/** localStorage から保存値を読む。不正値・例外時は null（自動判定へ）。 */
export function readStoredMode(storage: Storage | null): DisplayMode | null {
  try {
    const value = storage?.getItem(STORAGE_KEY)
    return value === 'compact' || value === 'full' ? value : null
  } catch {
    return null
  }
}

/** localStorage へ保存する。書き込み失敗（プライベートモード等）は無視。 */
export function writeStoredMode(
  storage: Storage | null,
  mode: DisplayMode,
): void {
  try {
    storage?.setItem(STORAGE_KEY, mode)
  } catch {
    // 書き込みできない環境では永続化を諦め、セッション内の状態のみで動く
  }
}
