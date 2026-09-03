# スマホモード デザイン（Issue #47）

作成日: 2026-08-30
対象Issue: #47「スマホモード」

## 背景と目的

iPhoneから地図を確認しにくい。主原因は凡例（路線選択UI）が62路線を縦に列挙し、
画面の大半を占有して地図がほぼ見えないこと。CSSにメディアクエリが一切なく、
モバイル最適化が存在しない。

目的: 小画面で地図が主役になるUIを提供する「スマホモード（compact表示）」を追加する。

## 要件（ユーザー決定事項）

| 項目 | 決定 |
|------|------|
| 切替方式 | 自動判定（画面幅）＋ 手動上書きボタン |
| 対応範囲 | 地図タブ全体（凡例・表示パネル・運休トグル）。乗換リストは対象外 |
| 路線選択UI | 折りたたみ式（閉じている限り地図は隠れない） |
| 手動上書きの永続化 | localStorage に保存し再訪問時に復元 |
| 既存デスクトップUI | 一切変更しない（full表示は現状の見た目・DOMを維持） |

## アーキテクチャ（採用: 案A — data属性 + CSSオーバーライド）

### `useDisplayMode` フック（新規 `src/ui/useDisplayMode.ts`）

モード判定の優先順位:

1. localStorage `display-mode` に `'compact' | 'full'` があれば尊重（手動上書き）
2. なければ `matchMedia('(max-width: 640px)')` で自動判定
3. ユーザーが切替ボタンを押したら localStorage に書き込み上書き

- 戻り値: `{ mode: 'compact' | 'full', isAuto: boolean, toggleMode(): void }`
- 判定ロジックは純粋関数 `resolveDisplayMode(stored, mediaMatches)` として
  分離し、フックはlocalStorage/matchMediaのI/Oのみ担う（ユニットテスト容易）
- matchMedia の変更リスナーを登録し、回転・リサイズで自動判定が追随
  （手動上書き中は追随しない）
- localStorage 読み書きは try/catch で包む。不正値・例外時は自動判定へ
  フォールバック（プライベートモード等でもクラッシュしない）

### 切替UI

`Header` 右端に小さなボタン（📱 / 🖥️）。全タブで共通の場所に配置。

### 適用方法

`App` のルートdivに `data-display={mode}` を付与。CSS は
`[data-display='compact'] …` セレクタでのみ上書きし、既定（full）の
スタイル宣言は一切変更しない。これにより「デスクトップ不変」を保証する。

## 各UIのcompact時の挙動

### 凡例（Legend）— 折りたたみ式

- `Legend` に `collapsible` prop を追加。`App` は `mode === 'compact'` の
  ときのみ渡す。propなし（full時）は現状のDOM・見た目完全不変
- compact時: 右上に「🚈 路線」ボタン（運休トグルと同デザインの小型
  オーバーレイ）。タップで地図上部を覆うシート（`.main` 内に absolute
  配置・白背景・`overflow-y: auto` でスクロール可）を開き、62路線一覧＋
  非公式乗換/都バス/データ元クレジットを表示。シートヘッダーの「閉じる」で戻る
- 開閉は `aria-expanded` / `aria-controls` 付き
- 路線行のタッチターゲットはcompact時に拡大（高さ44px目安）

### 表示パネル（DisplayPanel）

- compact時も折りたたみ式は現状踏襲。開いたときの内容幅を画面幅いっぱいに
  （`max-width` 系の制約を解除しチップが折返し）

### 運休トグル（SuspensionToggle）

- 位置・デザイン現状維持。compact時にpaddingを拡大しタップしやすく

### ヘッダー/タブバー

- compact時にタイトルのfont-size縮小とモード切替ボタン分の確保のみ。
  構造変更なし

## エラー処理

- localStorage の try/catch（前述）。失敗時は自動判定で継続
- compact用CSSが当たらない状況ではfull表示にフォールバック（既定がfull）

## テスト方針

プロジェクトは vitest 使用。既存テストはロジック中心でコンポーネント
テストなし（@testing-library/react 未導入）。

### ユニットテスト（新規 `useDisplayMode.test.ts`）

フックの純粋ロジックを検証:

- 自動判定: localStorage空 → matchMediaの結果に従う
- 手動上書き: localStorage='compact' → 幅が広くてもcompact
- 不正値: localStorage='hoge' → 無視して自動判定
- 切替: toggleMode()でlocalStorageに書き込みモード反転
- 例外: localStorageがthrowしてもクラッシュせず自動判定へ

matchMedia は jsdom に無いため `Object.defineProperty(window, 'matchMedia', …)`
でスタブ化する。

### 見送り（YAGNI）

- @testing-library/react の導入とコンポーネントテストは今回行わない。
  `collapsible` propなし時の描画保証は手動ブラウザ確認でカバー

### 検証コマンド

`npm run typecheck` / `npm run lint` / `npm run test:run` 全緑。
ブラウザのDevToolsでiPhone幅（375px）にして目視確認。
