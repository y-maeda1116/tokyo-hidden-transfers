import type { Line } from '../../domain/types.ts'

// 日暮里・舎人ライナー 全13駅（日暮里→見沼代親水公園）。座標は WGS84。
// すべて東京都内（荒川区〜足立区）。
// 座標は OpenStreetMap の route relation (id=3423146, 9253570) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const nipporiToneriLinerLine: Line = {
  id: 'nippori-toneri-liner',
  name: '日暮里・舎人ライナー',
  color: '#9b6fab',
  category: 'toei',
  stations: [
    { id: 'nt01', name: '日暮里', lineId: 'nippori-toneri-liner', lon: 139.7712873, lat: 35.7289168 },
    { id: 'nt02', name: '西日暮里', lineId: 'nippori-toneri-liner', lon: 139.7680432, lat: 35.7337204 },
    { id: 'nt03', name: '赤土小学校前', lineId: 'nippori-toneri-liner', lon: 139.7689755, lat: 35.7428641 },
    { id: 'nt04', name: '熊野前', lineId: 'nippori-toneri-liner', lon: 139.7698041, lat: 35.7485037 },
    { id: 'nt05', name: '足立小台', lineId: 'nippori-toneri-liner', lon: 139.7703354, lat: 35.7546723 },
    { id: 'nt06', name: '扇大橋', lineId: 'nippori-toneri-liner', lon: 139.77078, lat: 35.7639817 },
    { id: 'nt07', name: '高野', lineId: 'nippori-toneri-liner', lon: 139.7706489, lat: 35.7684884 },
    { id: 'nt08', name: '江北', lineId: 'nippori-toneri-liner', lon: 139.7702593, lat: 35.7739596 },
    { id: 'nt09', name: '西新井大師西', lineId: 'nippori-toneri-liner', lon: 139.7700397, lat: 35.7815513 },
    { id: 'nt10', name: '谷在家', lineId: 'nippori-toneri-liner', lon: 139.7700116, lat: 35.7887166 },
    { id: 'nt11', name: '舎人公園', lineId: 'nippori-toneri-liner', lon: 139.7700819, lat: 35.7963752 },
    { id: 'nt12', name: '舎人', lineId: 'nippori-toneri-liner', lon: 139.7700797, lat: 35.8056467 },
    { id: 'nt13', name: '見沼代親水公園', lineId: 'nippori-toneri-liner', lon: 139.7706798, lat: 35.8144994 },
  ],
}
