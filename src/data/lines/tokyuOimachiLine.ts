import type { Line } from '../../domain/types.ts'

// 東急大井町線 16駅（大井町→二子新地）。座標は WGS84。
// 東急大井町線。都内は大井町〜二子新地。高津・溝の口は川崎市。
// 駅id は tokyu-oimachi-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=9341647) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const tokyuOimachiLine: Line = {
  id: 'tokyu-oimachi',
  name: '東急大井町線',
  color: '#f7931e',
  category: 'private',
  stations: [
    { id: 'tokyu-oimachi-01', name: '大井町', lineId: 'tokyu-oimachi', lon: 139.7342793, lat: 35.6075687 },
    { id: 'tokyu-oimachi-02', name: '下神明', lineId: 'tokyu-oimachi', lon: 139.7262033, lat: 35.608783 },
    { id: 'tokyu-oimachi-03', name: '戸越公園', lineId: 'tokyu-oimachi', lon: 139.7183106, lat: 35.6089139 },
    { id: 'tokyu-oimachi-04', name: '中延', lineId: 'tokyu-oimachi', lon: 139.7127901, lat: 35.6058466 },
    { id: 'tokyu-oimachi-05', name: '荏原町', lineId: 'tokyu-oimachi', lon: 139.7075549, lat: 35.6038413 },
    { id: 'tokyu-oimachi-06', name: '旗の台', lineId: 'tokyu-oimachi', lon: 139.7027027, lat: 35.6048516 },
    { id: 'tokyu-oimachi-07', name: '北千束', lineId: 'tokyu-oimachi', lon: 139.6929574, lat: 35.6063785 },
    { id: 'tokyu-oimachi-08', name: '大岡山', lineId: 'tokyu-oimachi', lon: 139.6858386, lat: 35.6074796 },
    { id: 'tokyu-oimachi-09', name: '緑が丘', lineId: 'tokyu-oimachi', lon: 139.6789854, lat: 35.6065466 },
    { id: 'tokyu-oimachi-10', name: '自由が丘', lineId: 'tokyu-oimachi', lon: 139.6692629, lat: 35.607528 },
    { id: 'tokyu-oimachi-11', name: '九品仏', lineId: 'tokyu-oimachi', lon: 139.6611882, lat: 35.6053636 },
    { id: 'tokyu-oimachi-12', name: '尾山台', lineId: 'tokyu-oimachi', lon: 139.6537448, lat: 35.6070206 },
    { id: 'tokyu-oimachi-13', name: '等々力', lineId: 'tokyu-oimachi', lon: 139.6480129, lat: 35.6083157 },
    { id: 'tokyu-oimachi-14', name: '上野毛', lineId: 'tokyu-oimachi', lon: 139.6388373, lat: 35.6119483 },
    { id: 'tokyu-oimachi-15', name: '二子玉川', lineId: 'tokyu-oimachi', lon: 139.6268207, lat: 35.6117816 },
    { id: 'tokyu-oimachi-16', name: '二子新地', lineId: 'tokyu-oimachi', lon: 139.6225866, lat: 35.6071429 },
  ],
}
