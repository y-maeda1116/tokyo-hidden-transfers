import type { Line } from '../../domain/types.ts'

// 東京メトロ半蔵門線 全14駅（Z01渋谷→Z14押上）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=443279, 渋谷→押上) の
// role=stop ノード（停車位置）から取得。© OpenStreetMap contributors。
export const hanzomonLine: Line = {
  id: 'hanzomon',
  name: '東京メトロ半蔵門線',
  color: '#8f76d6',
  stations: [
    { id: 'z01', name: '渋谷', lineId: 'hanzomon', lon: 139.7020805, lat: 35.6595562 },
    { id: 'z02', name: '表参道', lineId: 'hanzomon', lon: 139.7122804, lat: 35.6651381 },
    { id: 'z03', name: '青山一丁目', lineId: 'hanzomon', lon: 139.7238851, lat: 35.6728653 },
    { id: 'z04', name: '永田町', lineId: 'hanzomon', lon: 139.7386335, lat: 35.6784077 },
    { id: 'z05', name: '半蔵門', lineId: 'hanzomon', lon: 139.741536, lat: 35.685237 },
    { id: 'z06', name: '九段下', lineId: 'hanzomon', lon: 139.7505399, lat: 35.695261 },
    { id: 'z07', name: '神保町', lineId: 'hanzomon', lon: 139.756919, lat: 35.6959843 },
    { id: 'z08', name: '大手町', lineId: 'hanzomon', lon: 139.7650427, lat: 35.6867555 },
    { id: 'z09', name: '三越前', lineId: 'hanzomon', lon: 139.773095, lat: 35.6850014 },
    { id: 'z10', name: '水天宮前', lineId: 'hanzomon', lon: 139.7856731, lat: 35.6825678 },
    { id: 'z11', name: '清澄白河', lineId: 'hanzomon', lon: 139.7992375, lat: 35.6821208 },
    { id: 'z12', name: '住吉', lineId: 'hanzomon', lon: 139.8156756, lat: 35.6887348 },
    { id: 'z13', name: '錦糸町', lineId: 'hanzomon', lon: 139.8149535, lat: 35.6963482 },
    { id: 'z14', name: '押上', lineId: 'hanzomon', lon: 139.8133278, lat: 35.7099434 },
  ],
}
