import type { Line } from '../../domain/types.ts'

// 西武新宿線 都内区間14駅（西武新宿→武蔵関）。座標は WGS84。
// 県境（埼玉）手前で切り取り。座標は主要駅ベースの推定値（Pages で要目視確認）。
// 注: 高田馬場は西武新宿線の駅（西武新宿の次）。池袋線ではない。
export const seibuShinjukuLine: Line = {
  id: 'seibu-shinjuku',
  name: '西武新宿線',
  color: '#d6a419',
  stations: [
    { id: 'ss01', name: '西武新宿', lineId: 'seibu-shinjuku', lon: 139.7015, lat: 35.6945 },
    { id: 'ss02', name: '高田馬場', lineId: 'seibu-shinjuku', lon: 139.7038, lat: 35.7124 },
    { id: 'ss03', name: '下落井', lineId: 'seibu-shinjuku', lon: 139.6990, lat: 35.7220 },
    { id: 'ss04', name: '中井', lineId: 'seibu-shinjuku', lon: 139.6845, lat: 35.7235 },
    { id: 'ss05', name: '新井薬師前', lineId: 'seibu-shinjuku', lon: 139.6770, lat: 35.7245 },
    { id: 'ss06', name: '沼袋', lineId: 'seibu-shinjuku', lon: 139.6695, lat: 35.7255 },
    { id: 'ss07', name: '野方', lineId: 'seibu-shinjuku', lon: 139.6630, lat: 35.7265 },
    { id: 'ss08', name: '都立家政', lineId: 'seibu-shinjuku', lon: 139.6560, lat: 35.7275 },
    { id: 'ss09', name: '鷺ノ宮', lineId: 'seibu-shinjuku', lon: 139.6495, lat: 35.7285 },
    { id: 'ss10', name: '下井草', lineId: 'seibu-shinjuku', lon: 139.6420, lat: 35.7295 },
    { id: 'ss11', name: '井荻', lineId: 'seibu-shinjuku', lon: 139.6345, lat: 35.7305 },
    { id: 'ss12', name: '上井草', lineId: 'seibu-shinjuku', lon: 139.6270, lat: 35.7315 },
    { id: 'ss13', name: '上石神井', lineId: 'seibu-shinjuku', lon: 139.6195, lat: 35.7325 },
    { id: 'ss14', name: '武蔵関', lineId: 'seibu-shinjuku', lon: 139.6120, lat: 35.7335 },
  ],
}
