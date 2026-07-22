import type { Line } from '../../domain/types.ts'

// 京成本線 都内区間8駅（日暮里→京成高砂）。座標は WGS84。
// 県境（江戸川）手前で切り取り。座標は主要駅ベースの推定値（Pages で要目視確認）。
export const keiseiLine: Line = {
  id: 'keisei',
  name: '京成本線',
  color: '#c9103b',
  stations: [
    { id: 'ks01', name: '日暮里', lineId: 'keisei', lon: 139.7713, lat: 35.7282 },
    { id: 'ks02', name: '新三河島', lineId: 'keisei', lon: 139.7735, lat: 35.7375 },
    { id: 'ks03', name: '町屋', lineId: 'keisei', lon: 139.7785, lat: 35.7445 },
    { id: 'ks04', name: '牛田', lineId: 'keisei', lon: 139.7835, lat: 35.7355 },
    { id: 'ks05', name: '堀切菖蒲園', lineId: 'keisei', lon: 139.7915, lat: 35.7325 },
    { id: 'ks06', name: 'お花茶屋', lineId: 'keisei', lon: 139.7995, lat: 35.7345 },
    { id: 'ks07', name: '青砥', lineId: 'keisei', lon: 139.8070, lat: 35.7410 },
    { id: 'ks08', name: '京成高砂', lineId: 'keisei', lon: 139.8170, lat: 35.7440 },
  ],
}
