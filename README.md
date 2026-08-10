# tokyo-hidden-transfers

東京の鉄道路線図と、徒歩・バス連絡による「非公式乗換」に加え、都営バス全系統をインタラクティブに可視化する Web アプリケーション。[MapLibre GL JS](https://maplibre.org/) で地図上に鉄道路線（太い実線）・都営バス全系統（細い実線）・徒歩の非公式乗換（点線）を描き、ホバーで駅名や徒歩時間・系統名を表示します。都営バスは公共交通オープンデータの GTFS-JP から全系統を取り込み、道路上の正確な経路で描画します（ズームインすると表示・🚌 都バストグルで切替）。

## 特徴

- **路線の可視化**: 鉄道（太い実線）とバス（細い実線）を路線ごとに色分け
- **非公式乗換の表現**: 徒歩連絡の近接駅を点線で結び、路線と明確に区別
- **都営バス全系統のプロット**: GTFS-JP から取り込んだ全系統を道路上の正確な経路で描画（lazy fetch・ズーム/トグル制御付き）
- **表示設定パネル**: 「🎛️ 表示」から事業者カテゴリ（JR/東京メトロ/都営/私鉄/その他）と地図要素（駅/振替ルート/都バス）の表示ON/OFFを切り替えられます。カテゴリを絞ると該当路線と駅が一括で切り替わります（個別路線切替は凡例で併用）
- **インタラクティブなツールチップ**: 駅や乗換にホバーで駅名・路線名・徒歩時間を表示（XSS 対策済み）
- **型安全なデータ**: TypeScript + [zod](https://zod.dev/) で駅・路線・乗換データを実行時検証

## 技術スタック

- [Vite](https://vite.dev/) + React 19 + TypeScript 7
- 地図描画: [MapLibre GL JS](https://maplibre.org/)
- データ: GeoJSON（TypeScript モジュールで生成、zod で検証）
- テスト: [Vitest](https://vitest.dev/)
- ホスティング: GitHub Pages（`main` ブランチ push で自動デプロイ）
- セキュリティ: [security-base](https://github.com/y-maeda1116/security-base) の設定を取り込み、npm audit・シークレットスキャン（Trivy）・Dependabot を運用

## 開発

### 必要環境

- Node.js 22.12 以上（CI は Node 24 を使用）

### セットアップ

```bash
npm ci          # 依存関係のインストール
npm run dev     # 開発サーバー（http://localhost:5173/tokyo-hidden-transfers/）
npm run build   # 本番ビルド（dist/）
npm run preview # ビルド成果物のローカル確認
```

### 品質チェック

```bash
npm run typecheck     # TypeScript の型チェック（tsc --noEmit）
npm run lint          # ESLint（security-base のセキュリティルール）
npm test              # Vitest（ウォッチモード）
npm run test:coverage # カバレッジ付きテスト実行（論理層 80% 以上を維持）
```

## データの追加方法

駅・路線・非公式乗換のデータは TypeScript で定義し、zod で検証しています。データは起動時に検証され、不正があればフェイルファストします。

### 路線の追加

1. `src/data/lines/` に新しい路線ファイルを作成します。

   ```ts
   import type { Line } from '../../domain/types.ts'

   export const yamanoteLine: Line = {
     id: 'yamanote',
     name: 'JR山手線',
     color: '#9acd32',
     mode: 'rail', // 省略可（省略時は rail）
     stations: [
       { id: 'shinjuku', name: '新宿', lineId: 'yamanote', lon: 139.7005, lat: 35.6896, mode: 'rail' },
       { id: 'shibuya', name: '渋谷', lineId: 'yamanote', lon: 139.7016, lat: 35.6588, mode: 'rail' },
     ],
   }
   ```

2. `src/data/index.ts` の `LineSchema.array().parse([...])` の配列に追加します。
3. `npm test` でスキーマ検証が通ることを確認します。

#### `mode` フィールド（交通手段）

路線と駅には `mode` を指定できます（省略時は `rail`）。

| 値 | 対象 | 描画 |
| --- | --- | --- |
| `rail` | 鉄道（既定） | 太い実線 |
| `bus` | 都営バス（GTFS 全系統） | 細い半透明の実線（路線色） |
| `tram` | 路面電車 | 鉄道と同幅の実線 |

#### バス路線（都営バス全系統）

都営バスは手定義せず、GTFS-JP オープンデータから全系統を一括取り込みします。

1. GTFS-JP zip を用意し `npm run build:bus -- <path-to-gtfs.zip>` を実行すると、`public/data/bus-routes.json` / `bus-stops.json` が再生成されます（データ元はスクリプト冒頭コメントに明記）。
2. 成果物はリポジトリにコミットします（元 zip は `.gitignore` で除外）。
3. アプリはズーム到達または🚌 都バストグル ON で lazy fetch して描画します（約4MB ため初期ロードには含めません）。
4. 編集ルール（手定義バス）は廃止しました。バスは GTFS 由来のみです。

### 駅の追加

路線ファイルの `stations` 配列に駅を追加します。各駅は以下を持ちます。

| フィールド | 内容 |
| --- | --- |
| `id` | 駅の一意 ID（例: `shinjuku-yamanote`） |
| `name` | 駅名 |
| `lineId` | 所属路線 ID |
| `lon` / `lat` | WGS84 の経度 / 緯度 |
| `mode` | 交通手段（`rail`/`bus`/`tram`、省略時は `rail`） |

### 非公式乗換の追加

`src/data/transfers.ts` に乗換オブジェクトを追加します。`fromStationId` / `toStationId` は既存の駅 ID を参照し、`walkMinutes` は 1 以上の整数です。

```ts
{
  id: 'shinjuku-transfer',
  fromStationId: 'shinjuku',
  toStationId: 'shinjuku-other',
  walkMinutes: 5,
  note: '改札外連絡',
}
```

参照先の駅が存在しない場合はビルド時にエラーになります（フェイルファスト）。

## デプロイ

`main` ブランチへの push で GitHub Actions がビルドし、GitHub Pages にデプロイします。

- URL: https://y-maeda1116.github.io/tokyo-hidden-transfers/
- ワークフロー: `.github/workflows/deploy.yml`

### CI / セキュリティ

| ワークフロー | 役割 |
| --- | --- |
| `deploy.yml` | GitHub Pages デプロイ |
| `ts-security.yml` | npm audit + ESLint セキュリティチェック |
| `secret-scan.yml` | Trivy によるシークレット検出（security-base の再利用可能ワークフロー） |

Dependabot が GitHub Actions と npm パッケージの週次アップデートを管理します。

> **備考（セキュリティ設定の技術制約）**: TypeScript 7 は `typescript-eslint` のサポート範囲外（peer が `typescript <6.1.0`）のため、`.ts/.tsx` は ESLint のリント対象外（`eslint.config.js` の ignores）とし、TS ファイルの静的解析は `tsc` と Trivy で代替しています。ESLint は flat config（`eslint.config.js`）で security-base のルールを `.js/.jsx` 等に適用します。

## プロジェクト構成

```
src/
├── config/        # 地図設定
├── domain/        # zod スキーマ・型（データモデルの単一ソース）
├── data/          # 路線・非公式乗換データ（zod 検証付き）
├── geojson/       # ドメイン → GeoJSON 変換の純粋関数
├── map/           # MapLibre 統合（ライフサイクル・レイヤー・ホバー）
│   └── tooltip/   # ツールチップ生成（XSS エスケープ付き）
└── ui/            # ヘッダー・凡例
```

## ライセンス・帰属

地図タイル: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

バスデータ（都営バス全系統）: [公共交通オープンデータセンター](https://www.odpt.org/) / [東京都オープンデータカタログ](https://catalog.data.metro.tokyo.lg.jp/dataset/t000018d0000000052) の都営バス GTFS-JP（アプリ画面の凡例にもクレジットを記載）
