import type { Line } from '../../domain/types.ts'

// 西武新宿線 都内区間14駅（西武新宿→武蔵関）。座標は WGS84。
// 県境（埼玉）手前で切り取り。
// 座標は OpenStreetMap の route relation (id=9506864, 9507191) の role=stop ノード（停車位置）から取得。
// 注: 高田馬場は西武新宿線の駅（西武新宿の次）。池袋線ではない。
// © OpenStreetMap contributors。
export const seibuShinjukuLine: Line = {
  id: 'seibu-shinjuku',
  name: '西武新宿線',
  color: '#d6a419',
  category: 'private',
  stations: [
    { id: 'ss01', name: '西武新宿', lineId: 'seibu-shinjuku', lon: 139.7000778, lat: 35.6960889 },
    { id: 'ss02', name: '高田馬場', lineId: 'seibu-shinjuku', lon: 139.7039436, lat: 35.7126218 },
    { id: 'ss03', name: '下落合', lineId: 'seibu-shinjuku', lon: 139.6953702, lat: 35.7157497 },
    { id: 'ss04', name: '中井', lineId: 'seibu-shinjuku', lon: 139.6862972, lat: 35.7150628 },
    { id: 'ss05', name: '新井薬師前', lineId: 'seibu-shinjuku', lon: 139.6726599, lat: 35.7156962 },
    { id: 'ss06', name: '沼袋', lineId: 'seibu-shinjuku', lon: 139.6647016, lat: 35.7193122 },
    { id: 'ss07', name: '野方', lineId: 'seibu-shinjuku', lon: 139.6531638, lat: 35.7196547 },
    { id: 'ss08', name: '都立家政', lineId: 'seibu-shinjuku', lon: 139.6448228, lat: 35.7223679 },
    { id: 'ss09', name: '鷺ノ宮', lineId: 'seibu-shinjuku', lon: 139.6396287, lat: 35.722638 },
    { id: 'ss10', name: '下井草', lineId: 'seibu-shinjuku', lon: 139.6253797, lat: 35.7238105 },
    { id: 'ss11', name: '井荻', lineId: 'seibu-shinjuku', lon: 139.6152612, lat: 35.7246469 },
    { id: 'ss12', name: '上井草', lineId: 'seibu-shinjuku', lon: 139.6031462, lat: 35.7252497 },
    { id: 'ss13', name: '上石神井', lineId: 'seibu-shinjuku', lon: 139.5924974, lat: 35.7261132 },
    { id: 'ss14', name: '武蔵関', lineId: 'seibu-shinjuku', lon: 139.5764401, lat: 35.7276511 },
  ],
}
