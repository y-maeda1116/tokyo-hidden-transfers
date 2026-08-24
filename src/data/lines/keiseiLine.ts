import type { Line } from '../../domain/types.ts'

// 京成本線 都内区間9駅（京成上野→京成高砂）。座標は WGS84。
// 県境（江戸川）手前で切り取り。
// 座標は OpenStreetMap の route relation (id=19928462, 19928461) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const keiseiLine: Line = {
  id: 'keisei',
  name: '京成本線',
  color: '#c9103b',
  category: 'private',
  stations: [
    { id: 'ks00', name: '京成上野', lineId: 'keisei', lon: 139.7736847, lat: 35.7109738 },
    { id: 'ks01', name: '日暮里', lineId: 'keisei', lon: 139.7709504, lat: 35.7283549 },
    { id: 'ks02', name: '新三河島', lineId: 'keisei', lon: 139.7739836, lat: 35.7371829 },
    { id: 'ks03', name: '町屋', lineId: 'keisei', lon: 139.7814134, lat: 35.7423145 },
    { id: 'ks04', name: '牛田', lineId: 'keisei', lon: 139.8121358, lat: 35.7446629 },
    { id: 'ks05', name: '堀切菖蒲園', lineId: 'keisei', lon: 139.8274828, lat: 35.7476602 },
    { id: 'ks06', name: 'お花茶屋', lineId: 'keisei', lon: 139.8401484, lat: 35.7476077 },
    { id: 'ks07', name: '青砥', lineId: 'keisei', lon: 139.856014, lat: 35.7455882 },
    { id: 'ks08', name: '京成高砂', lineId: 'keisei', lon: 139.8671246, lat: 35.7509218 },
  ],
}
