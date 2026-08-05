# 都バス GTFS 変換結果（規模記録）

- 生成日: 2026-08-06
- データソース: 公共交通オープンデータセンター（ODPT）`api-public.odpt.com/api/v4/files/Toei/data/ToeiBus-GTFS.zip`
- 変換コマンド: `npm run build:bus -- toei-gtfs.zip`
- 簡略化許容誤差: 0.00005 度（約 5.5m、Douglas-Peucker）

## 規模

| 成果物 | サイズ | Feature数 | 内容 |
| --- | --- | --- | --- |
| `src/data/bus/bus-routes.json` | 2.5MB | 763 | 151系統の道路上経路（LineString） |
| `src/data/bus/bus-stops.json` | 1.5MB | 5370 | 停留所（Point） |
| **合計** | **約4MB** | — | — |

※ 系統（route）151 に対し shape（経路形状）が 763 なのは、往復・方向・経路バリエーションごとに形状が分かれているため。

## Plan 2（アプリ統合）のロード方式判断

合計約 4MB はバンドルに同梱すると初期ロードを著しく重くする。したがって **lazy fetch** を推奨する:
- 成果物を `public/data/` 配信とし、都バストグル ON またはズーム到達時に `fetch` で読み込む
- 初期ロードは鉄道データのみ（現状維持）、都バスはユーザー操作契機で遅延読み込み

この判断は Plan 2 の設計に反映する。
