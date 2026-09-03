# スマホモード Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 画面幅で自動判定＋手動上書きできる「スマホモード（compact表示）」を追加し、小画面で地図が主役になるUIを提供する（Issue #47）。

**Architecture:** `useDisplayMode` フック（localStorage + matchMedia、判定は純粋関数 `resolveDisplayMode` に分離）がモードを決定し、`App` のルートdivの `data-display` 属性に反映。CSS は `[data-display='compact']` セレクタでのみ上書きし、既定（full）スタイルは一切変更しない。凡例は `collapsible` prop 付きの時だけ折りたたみUIを返す。

**Tech Stack:** React 19 + TypeScript + Vite / vitest / 既存CSS（index.css、CSSモジュールなし・BEM風クラス名）

**Spec:** `docs/superpowers/specs/2026-08-30-smartphone-mode-design.md`

**参考（既存パターン）:**
- フックの thin ラッパーパターン: `src/map/useDisplayState.ts`
- 折りたたみパネル: `src/ui/DisplayPanel.tsx`（ボタン + `aria-expanded` + 条件レンダリング）
- 左上オーバーレイのボタンデザイン: `.suspension-toggle`（`src/index.css:192`）

---

### Task 1: `resolveDisplayMode` と storage ヘルパー（TDD）

**Files:**
- Create: `src/ui/useDisplayMode.ts`
- Test: `src/ui/useDisplayMode.test.ts`

- [ ] **Step 1: 失敗するテストを書く**

`src/ui/useDisplayMode.test.ts` を作成:

```typescript
import { describe, expect, it } from 'vitest'
import {
  readStoredMode,
  resolveDisplayMode,
  writeStoredMode,
} from './useDisplayMode.ts'

/** インメモリStorage（プライベートモード等のテスト用） */
function createMemoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
    removeItem: (key: string) => {
      map.delete(key)
    },
    clear: () => {
      map.clear()
    },
    key: () => null,
    get length() {
      return map.size
    },
  } as Storage
}

/** 常にthrowするStorage（localStorage無効環境のテスト用） */
function createThrowingStorage(): Storage {
  const fail = () => {
    throw new Error('storage unavailable')
  }
  return {
    getItem: fail,
    setItem: fail,
    removeItem: fail,
    clear: fail,
    key: fail,
    get length() {
      return 0
    },
  } as Storage
}

describe('resolveDisplayMode', () => {
  it('手動上書きcompactは幅に関係なくcompact', () => {
    expect(resolveDisplayMode('compact', false)).toBe('compact')
    expect(resolveDisplayMode('compact', true)).toBe('compact')
  })

  it('手動上書きfullは幅に関係なくfull', () => {
    expect(resolveDisplayMode('full', false)).toBe('full')
    expect(resolveDisplayMode('full', true)).toBe('full')
  })

  it('未指定なら自動判定: 窄画面はcompact', () => {
    expect(resolveDisplayMode(null, true)).toBe('compact')
  })

  it('未指定なら自動判定: 広画面はfull', () => {
    expect(resolveDisplayMode(null, false)).toBe('full')
  })
})

describe('readStoredMode', () => {
  it('保存値があれば返す', () => {
    const storage = createMemoryStorage()
    storage.setItem('display-mode', 'compact')
    expect(readStoredMode(storage)).toBe('compact')
  })

  it('不正値はnull（自動判定へフォールバック）', () => {
    const storage = createMemoryStorage()
    storage.setItem('display-mode', 'hoge')
    expect(readStoredMode(storage)).toBeNull()
  })

  it('未保存はnull', () => {
    expect(readStoredMode(createMemoryStorage())).toBeNull()
  })

  it('storageが例外を投げてもnullを返しクラッシュしない', () => {
    expect(readStoredMode(createThrowingStorage())).toBeNull()
  })

  it('storageがnullでもnullを返す', () => {
    expect(readStoredMode(null)).toBeNull()
  })
})

describe('writeStoredMode', () => {
  it('書き込める', () => {
    const storage = createMemoryStorage()
    writeStoredMode(storage, 'compact')
    expect(storage.getItem('display-mode')).toBe('compact')
  })

  it('storageが例外を投げてもクラッシュしない', () => {
    expect(() =>
      writeStoredMode(createThrowingStorage(), 'full'),
    ).not.toThrow()
  })

  it('storageがnullでもクラッシュしない', () => {
    expect(() => writeStoredMode(null, 'compact')).not.toThrow()
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `npm run test:run -- src/ui/useDisplayMode.test.ts`
Expected: FAIL — `Cannot find module .../useDisplayMode.ts`（モジュール未作成のため）

- [ ] **Step 3: 最小実装を書く**

`src/ui/useDisplayMode.ts` を作成:

```typescript
export type DisplayMode = 'compact' | 'full'

const STORAGE_KEY = 'display-mode'
const COMPACT_MEDIA_QUERY = '(max-width: 640px)'

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
```

- [ ] **Step 4: テストを実行して通ることを確認**

Run: `npm run test:run -- src/ui/useDisplayMode.test.ts`
Expected: PASS（全12テスト）

- [ ] **Step 5: コミット**

```bash
git add src/ui/useDisplayMode.ts src/ui/useDisplayMode.test.ts
git commit -m "feat(ui): 表示モード判定の純粋関数とstorageヘルパーを追加"
```

---

### Task 2: `useDisplayMode` フック本体

**Files:**
- Modify: `src/ui/useDisplayMode.ts`（フックを追記）

判定ロジックは Task 1 でテスト済み。フックは localStorage / matchMedia の I/O をつなぐ thin ラッパーのため、新規テストは書かない（スペックの決定通り）。

- [ ] **Step 1: フックを実装**

`src/ui/useDisplayMode.ts` の先頭に import を追加し、末尾にフックを追記:

```typescript
import { useCallback, useEffect, useState } from 'react'
```

```typescript
/**
 * 表示モード（スマホ/デスクトップ）を提供するフック。
 * - localStorage に手動上書きがあればそれを尊重
 * - なければ matchMedia（max-width: 640px）で自動判定し、変更に追随
 */
export function useDisplayMode(): {
  mode: DisplayMode
  isAuto: boolean
  toggleMode: () => void
} {
  const [stored, setStored] = useState<DisplayMode | null>(() =>
    readStoredMode(window.localStorage),
  )
  const [mediaMatches, setMediaMatches] = useState(
    () => window.matchMedia(COMPACT_MEDIA_QUERY).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(COMPACT_MEDIA_QUERY)
    const onChange = (event: MediaQueryListEvent): void => {
      setMediaMatches(event.matches)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const isAuto = stored === null
  const mode = resolveDisplayMode(stored, mediaMatches)

  // 手動切替: 現在モードの逆を書き込み、以後は上書きモードとして扱う
  const toggleMode = useCallback(() => {
    const next: DisplayMode = mode === 'compact' ? 'full' : 'compact'
    writeStoredMode(window.localStorage, next)
    setStored(next)
  }, [mode])

  return { mode, isAuto, toggleMode }
}
```

- [ ] **Step 2: typecheck・lint・テストで壊れていないことを確認**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 全てOK（既存テスト含む全緑）

- [ ] **Step 3: コミット**

```bash
git add src/ui/useDisplayMode.ts
git commit -m "feat(ui): useDisplayModeフック（自動判定+手動上書き・localStorage永続化）"
```

---

### Task 3: Header に切替ボタン、App に data属性

**Files:**
- Modify: `src/ui/Header.tsx`（全体書き換え）
- Modify: `src/App.tsx`（import追加・フック呼び出し・data属性・Header/Legendへのprops）

- [ ] **Step 1: Header.tsx を書き換え**

`src/ui/Header.tsx` 全体:

```typescript
import type { DisplayMode } from './useDisplayMode.ts'

interface Props {
  mode: DisplayMode
  onToggleMode: () => void
}

/**
 * アプリヘッダー。右端に表示モード（スマホ/デスクトップ）の切替ボタンを持つ。
 * 切替は localStorage に永続化され、全タブで共通。
 */
export function Header({ mode, onToggleMode }: Props) {
  const compact = mode === 'compact'
  return (
    <header className="header">
      <div className="header-row">
        <div className="header-text">
          <h1 className="header-title">東京 非公式乗換マップ</h1>
          <p className="header-subtitle">
            徒歩連絡の非公式乗換と、鉄道路線＋都営バス全系統を表示
          </p>
        </div>
        <button
          type="button"
          className="display-mode-toggle"
          onClick={onToggleMode}
          aria-pressed={compact}
          title={
            compact
              ? 'デスクトップ表示に切り替えます'
              : 'スマホ表示（コンパクト）に切り替えます'
          }
        >
          {compact ? '🖥️' : '📱'}
        </button>
      </div>
    </header>
  )
}
```

注意: `isAuto` はスペックの戻り値に含まれるが、UIで使う箇所がないため Header には渡さない（YAGNI。App で受け取るだけにする）。

- [ ] **Step 2: App.tsx を修正**

`src/App.tsx` の変更点:

import に追加（`./ui/SuspensionToggle.tsx` のあたりへ）:

```typescript
import { useDisplayMode } from './ui/useDisplayMode.ts'
```

`App()` 内の state 宣言のあと（`const [focusTarget, setFocusTarget] = …` の次）に追加:

```typescript
  // 表示モード（スマホ/デスクトップ）。自動判定＋手動上書き、localStorage永続化。
  const displayMode = useDisplayMode()
```

return の JSX を変更:

```tsx
  return (
    <div className="app" data-display={displayMode.mode}>
      <Header mode={displayMode.mode} onToggleMode={displayMode.toggleMode} />
```

（`<Header />` を上の行で置き換え。既存の `<nav className="tabs">` 以下は変更しない。Legend への `collapsible` 渡しは Task 4 で追加する）

- [ ] **Step 3: typecheck・lint・テストで確認**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 全てOK

- [ ] **Step 4: ブラウザで手動確認**

Run: `npm run dev`
- 幅640px以下にするとHeader右端に🖥️ボタン（compact）
- 幅641px以上では📱ボタン（full）
- ボタンを押すとモードが切り替わり、リロードしても保持される
- この時点では見た目の変化はHeaderの絵文字のみ（CSS は Task 5）

- [ ] **Step 5: コミット**

```bash
git add src/ui/Header.tsx src/App.tsx
git commit -m "feat(ui): 表示モード切替ボタンとdata-display属性を追加"
```

---

### Task 4: Legend の折りたたみ（collapsible prop）

**Files:**
- Modify: `src/ui/Legend.tsx`（全体書き換え）
- Modify: `src/App.tsx`（Legend に `collapsible` を渡す）

- [ ] **Step 1: Legend.tsx を書き換え**

`src/ui/Legend.tsx` 全体:

```typescript
import { useState } from 'react'
import type { Line } from '../domain/types.ts'

interface Props {
  lines: readonly Line[]
  hiddenLineIds: ReadonlySet<string>
  onToggleLine: (lineId: string) => void
  busVisible: boolean
  /** スマホモード向け: 折りたたみボタン＋シート形式で描画する */
  collapsible?: boolean
}

interface ListProps {
  lines: readonly Line[]
  hiddenLineIds: ReadonlySet<string>
  onToggleLine: (lineId: string) => void
  busVisible: boolean
}

/** 路線一覧＋クレジット（full/compact 共用の中身）。 */
function LegendBody({ lines, hiddenLineIds, onToggleLine, busVisible }: ListProps) {
  return (
    <>
      <ul className="legend-lines">
        {lines.map((line) => {
          const hidden = hiddenLineIds.has(line.id)
          return (
            <li key={line.id} className="legend-line">
              <button
                type="button"
                className={`legend-toggle${hidden ? ' is-hidden' : ''}`}
                onClick={() => onToggleLine(line.id)}
                aria-pressed={!hidden}
                aria-label={`${line.name}を${hidden ? '表示' : '非表示'}`}
              >
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: line.color }}
                  aria-hidden="true"
                />
                <span className="legend-name">{line.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="legend-transfer">
        <span className="legend-dashed" aria-hidden="true" />
        <span>非公式乗換（徒歩連絡）</span>
      </p>
      <p className={`legend-bus${busVisible ? '' : ' is-hidden'}`}>
        <span className="legend-thin-solid" aria-hidden="true" />
        <span>都営バス全系統</span>
      </p>
      <p className="legend-source">
        バスデータ: 公共交通オープンデータセンター（都営バス GTFS-JP）
      </p>
      <p className="legend-source">鉄道駅座標: © OpenStreetMap contributors</p>
    </>
  )
}

/**
 * 凡例。各路線をトグルボタンとして表示ON/OFFを切り替える。
 * 非表示路線は半透明＋打ち消し線で状態を示す。
 * collapsible（スマホモード）では「🚈 路線」ボタン＋全画面シートで開閉し、
 * 閉じている間は地図を隠さない。
 */
export function Legend({
  lines,
  hiddenLineIds,
  onToggleLine,
  busVisible,
  collapsible = false,
}: Props) {
  const [open, setOpen] = useState(false)

  if (!collapsible) {
    return (
      <aside className="legend" aria-label="凡例">
        <h2 className="legend-title">路線（タップで表示切替）</h2>
        <LegendBody
          lines={lines}
          hiddenLineIds={hiddenLineIds}
          onToggleLine={onToggleLine}
          busVisible={busVisible}
        />
      </aside>
    )
  }

  return (
    <div className="legend-collapsible">
      <button
        type="button"
        className="legend-open-button"
        aria-expanded={open}
        aria-controls="legend-sheet"
        onClick={() => setOpen((prev) => !prev)}
      >
        🚈 路線
      </button>
      {open && (
        <div className="legend-sheet" id="legend-sheet" role="dialog" aria-label="路線一覧">
          <div className="legend-sheet-header">
            <h2 className="legend-title">路線（タップで表示切替）</h2>
            <button
              type="button"
              className="legend-sheet-close"
              onClick={() => setOpen(false)}
            >
              閉じる
            </button>
          </div>
          <LegendBody
            lines={lines}
            hiddenLineIds={hiddenLineIds}
            onToggleLine={onToggleLine}
            busVisible={busVisible}
          />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: App.tsx の Legend に collapsible を渡す**

`src/App.tsx` の `<Legend …>` を変更:

```tsx
            <Legend
              lines={lines}
              hiddenLineIds={display.state.hiddenLineIds}
              onToggleLine={display.toggleLine}
              busVisible={isLayerVisible('bus', display.state)}
              collapsible={displayMode.mode === 'compact'}
            />
```

- [ ] **Step 3: typecheck・lint・テストで確認**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 全てOK

- [ ] **Step 4: コミット**

```bash
git add src/ui/Legend.tsx src/App.tsx
git commit -m "feat(ui): 凡例をスマホモードで折りたたみ式にする"
```

---

### Task 5: compact用CSS

**Files:**
- Modify: `src/index.css`（末尾に追記。既存ルールは変更しない）

- [ ] **Step 1: index.css に追記**

`src/index.css` の末尾に追記:

```css
/* ヘッダー行（モード切替ボタン。full/compact共通の新規要素） */
.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.header-text {
  min-width: 0;
}
.display-mode-toggle {
  flex-shrink: 0;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}
.display-mode-toggle:hover {
  background: rgba(255, 255, 255, 0.35);
}

/* ---- スマホモード（compact）: [data-display='compact'] のみに適用 ---- */

/* ヘッダー/タブ: 縮小とタップ領域の確保 */
[data-display='compact'] .header {
  padding: 8px 12px;
}
[data-display='compact'] .header-title {
  font-size: 16px;
}
[data-display='compact'] .header-subtitle {
  font-size: 11px;
}
[data-display='compact'] .tab {
  padding: 12px 16px;
  font-size: 15px;
}

/* 凡例（折りたたみ）: 開くまで地図を隠さない */
.legend-collapsible {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}
.legend-open-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.legend-open-button:hover {
  background: #ffffff;
}
.legend-sheet {
  position: absolute;
  top: 44px;
  right: 0;
  width: min(92vw, 360px);
  max-height: calc(100dvh - 200px);
  overflow-y: auto;
  margin-top: 6px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 13px;
}
.legend-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.legend-sheet-header .legend-title {
  margin: 0;
}
.legend-sheet-close {
  flex-shrink: 0;
  padding: 6px 12px;
  border: 1px solid #dddddd;
  border-radius: 6px;
  background: #ffffff;
  color: #555555;
  font-size: 13px;
  cursor: pointer;
}

/* 表示パネル: 開いた内容を画面幅いっぱいに */
[data-display='compact'] .display-panel-content {
  width: calc(100vw - 24px);
  max-width: none;
}
[data-display='compact'] .display-panel-chip {
  padding: 8px 14px;
  font-size: 13px;
}

/* 運休トグル: タップしやすく */
[data-display='compact'] .suspension-toggle {
  padding: 10px 14px;
}

/* 凡例の路線行: タッチターゲット44px目安に拡大 */
[data-display='compact'] .legend-line {
  margin: 4px 0;
}
[data-display='compact'] .legend-toggle {
  min-height: 44px;
  padding: 8px 4px;
}
```

注意: `.legend-collapsible` 系のルールに `[data-display='compact']` プレフィクスが付いていないのは、`Legend` が `collapsible` のときのみこれらのクラスを描画するため（fullではDOMに存在しない）。

- [ ] **Step 2: typecheck・lint・テストで確認**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 全てOK

- [ ] **Step 3: ブラウザで手動確認（compact）**

Run: `npm run dev`
1. DevTools で 375×812（iPhone）にする → compactになる
2. 初期状態: 地図がほぼ全面に見え、右上に「🚈 路線」小ボタンのみ
3. 「🚈 路線」→ シートが開き62路線がスクロール表示、路線タップでON/OFF
4. 「閉じる」→ シートが閉じ地図が戻る
5. 「🎛️ 表示」→ 内容が画面幅いっぱいにチップ表示
6. 「🚧 山手線運休モード」がタップしやすい大きさ
7. Header右端「🖥️」→ fullに戻り、**従来通り右上に62路線の凡例が常に表示**される（デスクトップ不変の確認）
8. リロード → 手動上書きが保持される

- [ ] **Step 4: コミット**

```bash
git add src/index.css
git commit -m "feat(ui): スマホモードのcompactスタイルを追加"
```

---

### Task 6: 最終検証・Issue クローズ準備

**Files:**
- なし（検証のみ）

- [ ] **Step 1: 全テスト・型・リント**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 全てOK

- [ ] **Step 2: full表示のデグレがないことを再確認**

ブラウザで幅1280px以上:
- 凡例・表示パネル・運休トグルが従来の見た目・配置のまま
- Headerに📱ボタンが増えたこと以外、変化なし

- [ ] **Step 3: PR作成（ブランチ運行はユーザー指示に従う）**

dev ブランチで作業している場合、main または作業ブランチへの PR 方針はユーザーに確認する（記憶: push前にPR状態を確認すること）。

PR本文に `Closes #47` を含める。
