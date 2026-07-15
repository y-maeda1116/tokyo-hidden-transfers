# tokyo-hidden-transfers

東京の鉄道路線図と、徒歩連絡による「非公式乗換駅（近接駅）」をインタラクティブに可視化する Web アプリケーション。[MapLibre GL JS](https://maplibre.org/) で地図上に路線（実線）と非公式乗換（点線）を描き、ホバーで駅名や徒歩時間を表示します。

## 特徴

- **路線の可視化**: 複数路線を実線で路線ごとに色分け
- **非公式乗換の表現**: 徒歩連絡の近接駅を点線で結び、通常路線と明確に区別
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
     stations: [
       { id: 'shinjuku', name: '新宿', lineId: 'yamanote', lon: 139.7005, lat: 35.6896 },
       { id: 'shibuya', name: '渋谷', lineId: 'yamanote', lon: 139.7016, lat: 35.6588 },
     ],
   }
   ```

2. `src/data/index.ts` の `LineSchema.array().parse([...])` の配列に追加します。
3. `npm test` でスキーマ検証が通ることを確認します。

### 駅の追加

路線ファイルの `stations` 配列に駅を追加します。各駅は以下を持ちます。

| フィールド | 内容 |
| --- | --- |
| `id` | 駅の一意 ID（例: `shinjuku-yamanote`） |
| `name` | 駅名 |
| `lineId` | 所属路線 ID |
| `lon` / `lat` | WGS84 の経度 / 緯度 |

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

> **備考（セキュリティ設定の技術制約）**: TypeScript 7 は `typescript-eslint` のサポート範囲外（peer が `typescript <6.1.0`）のため、ESLint は security-base のルール設定を取り込みつつ、TS ファイルの静的解析は `tsc` と Trivy で代替しています。また `eslint` は security-base ワークフローとの互換のため `8.57.1` に固定しています（Dependabot の ignore 設定で 9/10 系への更新を抑止）。

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
