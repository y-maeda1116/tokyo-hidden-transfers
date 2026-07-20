import type { Line } from '../../domain/types.ts'

// 東京メトロ南北線 全19駅（N01目黒→N19赤羽岩淵）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=7730199 / 8026070) の role=stop
// ノードから取得。© OpenStreetMap contributors。
// 補足: OSM で両端の stop ノードが各 relation で欠落していたため、目黒は三田線(m01)
// と同一位置の座標を使用、赤羽岩淵は逆方向 relation から補完。
// また stop ノード名の「市ヶ谷駅」「西ヶ原駅」は公式駅名（市ケ谷・西ケ原）に修正。
export const nambokuLine: Line = {
  id: 'namboku',
  name: '東京メトロ南北線',
  color: '#00ac9b',
  stations: [
    { id: 'n01', name: '目黒', lineId: 'namboku', lon: 139.715833, lat: 35.634028 },
    { id: 'n02', name: '白金台', lineId: 'namboku', lon: 139.7265558, lat: 35.6381169 },
    { id: 'n03', name: '白金高輪', lineId: 'namboku', lon: 139.7341229, lat: 35.6429466 },
    { id: 'n04', name: '麻布十番', lineId: 'namboku', lon: 139.7370659, lat: 35.6551771 },
    { id: 'n05', name: '六本木一丁目', lineId: 'namboku', lon: 139.738939, lat: 35.6649588 },
    { id: 'n06', name: '溜池山王', lineId: 'namboku', lon: 139.7413433, lat: 35.6730057 },
    { id: 'n07', name: '永田町', lineId: 'namboku', lon: 139.7391381, lat: 35.6784978 },
    { id: 'n08', name: '四ツ谷', lineId: 'namboku', lon: 139.7294234, lat: 35.6855806 },
    { id: 'n09', name: '市ケ谷', lineId: 'namboku', lon: 139.7366992, lat: 35.6933168 },
    { id: 'n10', name: '飯田橋', lineId: 'namboku', lon: 139.7436617, lat: 35.7015212 },
    { id: 'n11', name: '後楽園', lineId: 'namboku', lon: 139.7517502, lat: 35.7082166 },
    { id: 'n12', name: '東大前', lineId: 'namboku', lon: 139.7581322, lat: 35.7173083 },
    { id: 'n13', name: '本駒込', lineId: 'namboku', lon: 139.7536398, lat: 35.7247547 },
    { id: 'n14', name: '駒込', lineId: 'namboku', lon: 139.7466942, lat: 35.7359676 },
    { id: 'n15', name: '西ケ原', lineId: 'namboku', lon: 139.7421173, lat: 35.7460173 },
    { id: 'n16', name: '王子', lineId: 'namboku', lon: 139.7374489, lat: 35.7539405 },
    { id: 'n17', name: '王子神谷', lineId: 'namboku', lon: 139.7357007, lat: 35.765049 },
    { id: 'n18', name: '志茂', lineId: 'namboku', lon: 139.7324778, lat: 35.7778789 },
    { id: 'n19', name: '赤羽岩淵', lineId: 'namboku', lon: 139.7219243, lat: 35.7834912 },
  ],
}
