import type { Line } from '../../domain/types.ts'

// 東武東上線 都内区間10駅（池袋→成増）。座標は WGS84。
// 県境（埼玉）手前で切り取り。
// 座標は OpenStreetMap の route relation (id=10032017, 10032085) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const tobuTojoLine: Line = {
  id: 'tobu-tojo',
  name: '東武東上線',
  color: '#0094d0',
  category: 'private',
  stations: [
    { id: 'tobu-ikebukuro', name: '池袋', lineId: 'tobu-tojo', lon: 139.7107697, lat: 35.7303213 },
    { id: 'tobu-kita-ikebukuro', name: '北池袋', lineId: 'tobu-tojo', lon: 139.7168675, lat: 35.7409711 },
    { id: 'tobu-shimo-itabashi', name: '下板橋', lineId: 'tobu-tojo', lon: 139.7155325, lat: 35.7452404 },
    { id: 'tobu-oyama', name: '大山', lineId: 'tobu-tojo', lon: 139.7024528, lat: 35.7486322 },
    { id: 'tobu-naka-itabashi', name: '中板橋', lineId: 'tobu-tojo', lon: 139.6941593, lat: 35.7564284 },
    { id: 'tobu-tokiwadai', name: 'ときわ台', lineId: 'tobu-tojo', lon: 139.6885556, lat: 35.7589509 },
    { id: 'tobu-kami-itabashi', name: '上板橋', lineId: 'tobu-tojo', lon: 139.676569, lat: 35.7635967 },
    { id: 'tobu-nerima', name: '東武練馬', lineId: 'tobu-tojo', lon: 139.6625349, lat: 35.7686348 },
    { id: 'tobu-shimo-akatsuka', name: '下赤塚', lineId: 'tobu-tojo', lon: 139.6445613, lat: 35.7706051 },
    { id: 'tobu-narimasu', name: '成増', lineId: 'tobu-tojo', lon: 139.6329169, lat: 35.7776274 },
  ],
}
