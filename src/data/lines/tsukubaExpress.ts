import type { Line } from '../../domain/types.ts'

// つくばエクスプレス 都内区間7駅（秋葉原→六町）。座標は WGS84。
// 県境（埼玉・八潮）手前で切り取り。南千住・青井・六町を追加し都内全駅に。
// 座標は OpenStreetMap の route relation (id=2549404, 4589046) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const tsukubaExpress: Line = {
  id: 'tsukuba-express',
  name: 'つくばエクスプレス',
  color: '#005bac',
  category: 'other',
  stations: [
    { id: 'tx00', name: '秋葉原', lineId: 'tsukuba-express', lon: 139.7742615, lat: 35.6988368 },
    { id: 'tx01', name: '新御徒町', lineId: 'tsukuba-express', lon: 139.7820476, lat: 35.7070716 },
    { id: 'asakusa-tx', name: '浅草', lineId: 'tsukuba-express', lon: 139.7923668, lat: 35.7135947 },
    { id: 'minamisenju-tx', name: '南千住', lineId: 'tsukuba-express', lon: 139.7988421, lat: 35.7328634 },
    { id: 'kitasenju', name: '北千住', lineId: 'tsukuba-express', lon: 139.8051789, lat: 35.7495161 },
    { id: 'aoi-tx', name: '青井', lineId: 'tsukuba-express', lon: 139.820289, lat: 35.771746 },
    { id: 'rokumachi-tx', name: '六町', lineId: 'tsukuba-express', lon: 139.8218461, lat: 35.7848577 },
  ],
}
