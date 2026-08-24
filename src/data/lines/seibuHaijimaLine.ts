import type { Line } from '../../domain/types.ts'

// 西武拝島線 8駅（小平→拝島）。座標は WGS84。
// 西武拝島線。小平→拝島、全駅都内（小平市・立川市・昭島市）。
// 駅id は seibu-haijima-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=9507232) のメンバーから取得。
// ※ relation のメンバー順では玉川上水が末尾だったが、実際の駅順（東大和市の次）に入れ替え。
// © OpenStreetMap contributors。
export const seibuHaijimaLine: Line = {
  id: 'seibu-haijima',
  name: '西武拝島線',
  color: '#ff9d5c',
  category: 'private',
  stations: [
    { id: 'seibu-haijima-01', name: '小平', lineId: 'seibu-haijima', lon: 139.4881894, lat: 35.736931 },
    { id: 'seibu-haijima-02', name: '萩山', lineId: 'seibu-haijima', lon: 139.4770441, lat: 35.7407822 },
    { id: 'seibu-haijima-03', name: '小川', lineId: 'seibu-haijima', lon: 139.4636791, lat: 35.7373932 },
    { id: 'seibu-haijima-04', name: '東大和市', lineId: 'seibu-haijima', lon: 139.4345149, lat: 35.7328579 },
    { id: 'seibu-haijima-05', name: '玉川上水', lineId: 'seibu-haijima', lon: 139.4183559, lat: 35.7316251 },
    { id: 'seibu-haijima-06', name: '武蔵砂川', lineId: 'seibu-haijima', lon: 139.3920819, lat: 35.7288655 },
    { id: 'seibu-haijima-07', name: '西武立川', lineId: 'seibu-haijima', lon: 139.3701507, lat: 35.7262198 },
    { id: 'seibu-haijima-08', name: '拝島', lineId: 'seibu-haijima', lon: 139.3439814, lat: 35.7214282 },
  ],
}
