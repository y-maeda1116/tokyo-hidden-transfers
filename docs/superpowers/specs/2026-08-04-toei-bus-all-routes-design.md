# 都バス全系統プロット 設計書

- 日付: 2026-08-04
- 状態: 承認済み（ブレインストーミング合意）→ 実装計画待ち

## 1. 背景・目的

tokyo-hidden-transfers は東京の鉄道路線図と、徒歩・バス連絡の「非公式乗換」を MapLibre で可視化するアプリ。現状、バス路線は編集ルール上「鉄道で直接繋がらない2点を結ぶ系統のみ」に限定され、都営バス草43（浅草雷門↔千住大橋）が唯一の例。

本仕様は、この限定を撤廃し **都営バス（東京都交通局）の全系統を網羅的にプロット** する。アプリの位置づけを「非公式乗換の可視化」から「鉄道＋バスの総合路線図」へ拡張する。

## 2. スコープ

- **対象**: 都営バスの全系統・全停留所。GTFS-JP オープンデータから取り込み、道路上の正確な経路で描画する。
- **対象外**: 都電荒川線（既存 `tram` のまま）、民営バス、リアルタイム情報（GTFS-RT）。

## 3. 決定事項（合意内容）

| 項目 | 決定 |
| --- | --- |
| スコープ | 都バス全系統を網羅（コンセプト変更） |
| データ取得 | GTFS-JP を変換スクリプトで GeoJSON 化し、**成果物をリポジトリにコミット**。ビルドは外部データに依存しない（再現的・CI安定・セキュリティ） |
| 統合方式 | 都バス専用のソース・レイヤーを新設。既存の `Line`/`Station` モデル（zod検証・手定義）は変更しない |
| 視認性 | ズームレベル制御（`minzoom`）＋ 都バス ON/OFF トグル |
| 草43の扱い | 手定義の草43を**廃止**し、GTFS 全系統に一本化。`transfers.ts` の草43乗換は GTFS 停留所を指すよう更新 |

## 4. アーキテクチャ

### 4.1 データフロー

```
GTFS-JP.zip（公共交通オープンデータセンター/東京都カタログ）
  ├ routes.txt  ─┐
  ├ shapes.txt  ─┼─▶ build-bus-geojson.ts（ビルド時・手動実行）
  └ stops.txt   ─┘        ├ parseGtfs（zip解凍・CSVパース）
                          ├ simplifyShape（Douglas-Peucker 簡略化）
                          └ buildBusFeatures（shapes→LineString, stops→Point）
                                  │
                          bus-routes.geojson  bus-stops.geojson
                                  │（リポジトリにコミット）
                                  ▼
  vite import → FeatureCollectionSchema 検証（zod）→ MapContainer
                                  │
        bus-routes-source/layer（line, route_color, minzoom=12）
        bus-stops-source/layer （circle, minzoom=14）
                                  │
            ズーム制御 + BusToggle(busVisible) で表示制御
```

### 4.2 コンポーネント構成

**新規ファイル**

| パス | 役割 |
| --- | --- |
| `scripts/build-bus-geojson.ts` | エントリポイント。GTFS 読み込み→GeoJSON 生成→ファイル出力 |
| `scripts/gtfs/parseGtfs.ts` | zip 解凍・CSV パースの純粋関数 |
| `scripts/gtfs/simplifyShape.ts` | Douglas-Peucker による経路簡略化の純粋関数 |
| `scripts/gtfs/buildBusFeatures.ts` | shapes→LineString / stops→Point 構築の純粋関数 |
| `scripts/gtfs/*.test.ts` | 上記の単体テスト |
| `src/data/bus/bus-routes.geojson` | 生成成果物（コミット対象） |
| `src/data/bus/bus-stops.geojson` | 生成成果物（コミット対象） |
| `src/data/bus/index.ts` | GeoJSON import + `FeatureCollectionSchema` 検証 |
| `src/ui/BusToggle.tsx` | 都バス ON/OFF トグル（`SuspensionToggle` と同パターン） |

**変更ファイル**

| パス | 変更内容 |
| --- | --- |
| `src/map/layerStyles.ts` | `SOURCE_IDS`/`LAYER_IDS` に都バス追加、`busRoutesLayer`/`busStopsLayer` 追加 |
| `src/map/addDataLayers.ts` | 都バスソース・レイヤーの追加 |
| `src/map/MapContainer.tsx` | `busVisible` 連携、都バスレイヤー表示切替、ホバー設定 |
| `src/map/tooltip/` | 都バス用ツールチップ（系統名表示） |
| `src/App.tsx` | `busVisible` 状態追加、`BusToggle` 配置 |
| `src/ui/Legend.tsx` | 都バス凡例追加 |
| `src/data/index.ts` | 草43（`kusa43Line`）の import・配列参照を削除 |
| `src/data/lines/kusa43Line.ts` | **削除** |
| `src/data/transfers.ts` | 草43乗換2件の停留所ID参照を GTFS 側に更新 |
| `README.md` | コンセプト・編集ルール・GTFS クレジット表記を更新 |
| `package.json` | `build:bus` スクリプト追加、変換用依存追加 |

## 5. データモデル

### 5.1 `bus-routes.geojson`（LineString）

```jsonc
{
  "type": "Feature",
  "geometry": { "type": "LineString", "coordinates": [[lon, lat], ...] },
  "properties": {
    "kind": "bus-route",
    "routeId": "<GTFS route_id>",
    "shortName": "<route_short_name 例: 上26>",
    "longName": "<route_long_name>",
    "color": "<route_color 例: #7ac46b>"
  }
}
```

- `color` は `routes.txt` の `route_color`。未設定/不正時は既定色 `#00853f`（都営バス標準色）でフォールバック。

### 5.2 `bus-stops.geojson`（Point）

```jsonc
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [lon, lat] },
  "properties": {
    "kind": "bus-stop",
    "stopId": "<GTFS stop_id>",
    "name": "<stop_name>"
  }
}
```

### 5.3 不変条件

- 既存編集ルール「バス停名は鉄道駅名と完全一致させてはならない」（`transferList.ts` の同名マージ防止）は、GTFS 側でも維持する。変換時に同名のバス停が鉄道駅名と衝突しないか検証し、衝突時は警告を出す。
- GeoJSON は既存 `FeatureCollectionSchema`（`src/domain/geojsonSchema.ts`）で検証する（実行時フェイルファスト）。

## 6. 描画・視認性

| レイヤー | 種別 | スタイル | minzoom |
| --- | --- | --- | --- |
| `bus-routes-layer` | line | `line-color=['get','color']`, `line-width=2`, `line-opacity=0.7` | 12 |
| `bus-stops-layer` | circle | `circle-radius=4`, 路線色 | 14 |

- 広域（縮小）時は都バスを非表示にし、詳細ズームでのみ描画。密集時の視認性崩壊と初期ロード負荷を抑制する。
- 既存の鉄道レイヤー（`lines`/`stations`）との描画順は、鉄道を都バスより上に重ねて鉄道の視認性を優先する。

## 7. UI・状態

- `busVisible: boolean`（`App.tsx`、**デフォルト `true`**）。ユーザーが都バスを見たいという要望に応え初期表示する。ただし `minzoom` 制御により広域時は描画されないため、初期ロードへの影響は限定的。
- `BusToggle` は既存 `SuspensionToggle` と同じUIパターンで、鉄道中心で見たいときに都バスを隠せる。
- `MapContainer` は `busVisible` に応じて都バスレイヤーの `visibility` を切替。
- `Legend` に都バス（細線）の凡例を追加。
- ホバーで系統名（`shortName` / `longName`）をツールチップ表示。XSS 対策は既存 `tooltip/` のエスケープを踏襲。

## 8. 草43統合

- `src/data/lines/kusa43Line.ts` を削除。`src/data/index.ts` の import と `validatedLines` 配列から除去。
- `src/data/transfers.ts` の以下2件を、GTFS 側の停留所 ID に更新:
  - `bus-kusa43-asakusa`（`toStationId: k43-01`）→ GTFS「浅草雷門」停留所 ID
  - `bus-kusa43-kitasenju`（`toStationId: k43-09`）→ GTFS「千住大橋」停留所 ID
- 停留所 ID の対応は、変換スクリプトが該当バス停の `stop_id` を出力するので、それを `transfers.ts` に記述する。`stationsById` ルックアップが都バス停留所も含むよう、データ統合箇所を調整する。

## 9. エラー処理

- **変換スクリプト**: 必須ファイル（`routes.txt`/`shapes.txt`/`stops.txt`）欠損時はフェイルファスト。原因と対象ファイルを明示したエラーメッセージ。
- **`route_color` 不正**: 正規表式 `^#[0-9a-fA-F]{6}$` で検証、不合格時は既定色へフォールバック（警告ログ）。
- **実行時**: 生成済み GeoJSON を `FeatureCollectionSchema` で検証（既存パターン踏襲）。

## 10. テスト

- `parseGtfs`: 必須ファイル欠損でエラー、正常パースの確認。
- `simplifyShape`: 許容誤差内で点数が削減されること、経路の端点が保持されること。
- `buildBusFeatures`: shapes→LineString、stops→Point の構築が正しいこと、`route_color` 未設定のフォールバック。
- 既存テスト（`builders`/`filters`/`schemas`/`transferList`/`index`）が草43削除後も通ること。

## 11. パフォーマンス

- Douglas-Peucker（許容誤差 約5m 程度）で shapes を簡略化し、全系統でも GeoJSON を数百KB〜数MBに収める想定。
- `minzoom` で広域時の描画負荷を抑制。
- 実データでの実測を必須とする。生 GeoJSON で重い場合は、ベクトルタイル化（Tippecanoe 等）を**別フェーズ**で検討する（本仕様の対象外）。
- **ロード方式**（バンドル同梱 vs lazy fetch）は、実データ規模の実測結果に基づき実装計画で決定する。数MB規模ならトグル/ズーム契機の lazy fetch が初期ロード軽減に有効。

## 12. ライセンス・クレジット

- データ元: 公共交通オープンデータセンター（ODPT）/ 東京都オープンデータカタログ の都営バス GTFS-JP。
- `README.md` の帰属セクションとアプリ画面（フッタ等）にクレジット表記を追加。
- 変換スクリプトにはデータ取得元 URL と取得日をコメントで明記し、再現性を担保する。

## 13. 実装フェーズ（参考）

1. 変換スクリプト + 単体テスト（GTFS→GeoJSON、簡略化）
2. 成果物生成・コミット、実データでのデータ規模実測
3. レイヤー・描画統合（`minzoom`、描画順）
4. トグル・`busVisible` 状態・`Legend`
5. ツールチップ（系統名）
6. 草43統合・`transfers.ts` 更新
7. `README`・クレジット更新
8. パフォーマンス実測・簡略化度合いの調整

## 14. 依存関係（参考・実装計画で確定）

- zip 解凍: メンテされている軽量ライブラリ（`yauzl` / `unzipper` 等、セキュリティ設定を考慮し選定）。
- CSV パース: `csv-parse`（引用符の扱いの安全性）。
- 簡略化: 自前の Douglas-Peucker 実装で依存を増やさない方向を基本とする。
- 依存追加は `npm audit` と Trivy シークレットスキャンの対象とする。
