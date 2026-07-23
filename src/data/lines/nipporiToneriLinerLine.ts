import type { Line } from '../../domain/types.ts'

// 日暮里・舎人ライナー 全13駅（日暮里→見沼代親水公園）。座標は WGS84。
// すべて東京都内（荒川区〜足立区）。座標は主要駅ベースの推定値（Pages で要目視確認）。
export const nipporiToneriLinerLine: Line = {
  id: 'nippori-toneri-liner',
  name: '日暮里・舎人ライナー',
  color: '#9b6fab',
  stations: [
    { id: 'nt01', name: '日暮里', lineId: 'nippori-toneri-liner', lon: 139.7713, lat: 35.7282 },
    { id: 'nt02', name: '西日暮里', lineId: 'nippori-toneri-liner', lon: 139.7664, lat: 35.7320 },
    { id: 'nt03', name: '赤土小学校前', lineId: 'nippori-toneri-liner', lon: 139.7625, lat: 35.7390 },
    { id: 'nt04', name: '熊野前', lineId: 'nippori-toneri-liner', lon: 139.7575, lat: 35.7470 },
    { id: 'nt05', name: '足立小台', lineId: 'nippori-toneri-liner', lon: 139.7525, lat: 35.7550 },
    { id: 'nt06', name: '扇大橋', lineId: 'nippori-toneri-liner', lon: 139.7485, lat: 35.7625 },
    { id: 'nt07', name: '高野', lineId: 'nippori-toneri-liner', lon: 139.7465, lat: 35.7700 },
    { id: 'nt08', name: '江戸川', lineId: 'nippori-toneri-liner', lon: 139.7460, lat: 35.7775 },
    { id: 'nt09', name: '西新井大師西', lineId: 'nippori-toneri-liner', lon: 139.7475, lat: 35.7845 },
    { id: 'nt10', name: '谷在家', lineId: 'nippori-toneri-liner', lon: 139.7510, lat: 35.7910 },
    { id: 'nt11', name: '舎人公園', lineId: 'nippori-toneri-liner', lon: 139.7550, lat: 35.7975 },
    { id: 'nt12', name: '舎人', lineId: 'nippori-toneri-liner', lon: 139.7595, lat: 35.8035 },
    { id: 'nt13', name: '見沼代親水公園', lineId: 'nippori-toneri-liner', lon: 139.7645, lat: 35.8100 },
  ],
}
