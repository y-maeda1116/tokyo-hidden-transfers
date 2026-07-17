import type { Line } from '../../domain/types.ts'

// 都営三田線 全27駅（I01目黒→I27西高島平）。座標は WGS84。
// 確定10駅は Wikipedia、残り17駅は直線補間（推定）。
// 北側(m18-m27)は新板橋(確定)と西高島平(知識ベース)で補間。地図表示で要微修正。
// 注: 三田線に田町・大門・新橋・二重橋前は乗り入れていない（過去の誤認を訂正）。
export const mitaLine: Line = {
  id: 'mita',
  name: '都営三田線',
  color: '#0078ba',
  stations: [
    { id: 'm01', name: '目黒', lineId: 'mita', lon: 139.715833, lat: 35.634028 },
    { id: 'm02', name: '白金台', lineId: 'mita', lon: 139.724986, lat: 35.638458 },
    { id: 'm03', name: '白金高輪', lineId: 'mita', lon: 139.734139, lat: 35.642889 },
    { id: 'm04', name: '三田', lineId: 'mita', lon: 139.747222, lat: 35.646889 },
    { id: 'm05', name: '芝公園', lineId: 'mita', lon: 139.749389, lat: 35.654042 },
    { id: 'm06', name: '御成門', lineId: 'mita', lon: 139.751556, lat: 35.661194 },
    { id: 'm07', name: '内幸町', lineId: 'mita', lon: 139.756315, lat: 35.669037 },
    { id: 'm08', name: '日比谷', lineId: 'mita', lon: 139.761074, lat: 35.67688 },
    { id: 'm09', name: '大手町', lineId: 'mita', lon: 139.765833, lat: 35.684722 },
    { id: 'm10', name: '神保町', lineId: 'mita', lon: 139.759722, lat: 35.693361 },
    { id: 'm11', name: '水道橋', lineId: 'mita', lon: 139.753611, lat: 35.702 },
    { id: 'm12', name: '春日', lineId: 'mita', lon: 139.75325, lat: 35.709639 },
    { id: 'm13', name: '白山', lineId: 'mita', lon: 139.748611, lat: 35.717583 },
    { id: 'm14', name: '千石', lineId: 'mita', lon: 139.743972, lat: 35.725528 },
    { id: 'm15', name: '巣鴨', lineId: 'mita', lon: 139.739333, lat: 35.733472 },
    { id: 'm16', name: '西巣鴨', lineId: 'mita', lon: 139.728722, lat: 35.7435 },
    { id: 'm17', name: '新板橋', lineId: 'mita', lon: 139.719611, lat: 35.748778 },
    { id: 'm18', name: '板橋区役所前', lineId: 'mita', lon: 139.711199, lat: 35.752958 },
    { id: 'm19', name: '板橋本町', lineId: 'mita', lon: 139.702787, lat: 35.757139 },
    { id: 'm20', name: '本蓮沼', lineId: 'mita', lon: 139.694375, lat: 35.761319 },
    { id: 'm21', name: '志村坂上', lineId: 'mita', lon: 139.685963, lat: 35.7655 },
    { id: 'm22', name: '志村三丁目', lineId: 'mita', lon: 139.677551, lat: 35.769681 },
    { id: 'm23', name: '蓮根', lineId: 'mita', lon: 139.669139, lat: 35.773861 },
    { id: 'm24', name: '西台', lineId: 'mita', lon: 139.660727, lat: 35.778042 },
    { id: 'm25', name: '高島平', lineId: 'mita', lon: 139.652315, lat: 35.782222 },
    { id: 'm26', name: '新高島平', lineId: 'mita', lon: 139.643903, lat: 35.786403 },
    { id: 'm27', name: '西高島平', lineId: 'mita', lon: 139.6439, lat: 35.7864 },
  ],
}
