import type { Line } from '../../domain/types.ts'

// 東武東上線 都内区間（池袋→成増）。座標は主要駅ベースの推定値（Pages で要目視確認）。
export const tobuTojoLine: Line = {
  id: 'tobu-tojo',
  name: '東武東上線',
  color: '#0094d0',
  category: 'private',
  stations: [
    { id: 'tobu-ikebukuro', name: '池袋', lineId: 'tobu-tojo', lon: 139.7100, lat: 35.7295 },
    { id: 'tobu-kita-ikebukuro', name: '北池袋', lineId: 'tobu-tojo', lon: 139.7150, lat: 35.7390 },
    { id: 'tobu-shimo-itabashi', name: '下板橋', lineId: 'tobu-tojo', lon: 139.7210, lat: 35.7450 },
    { id: 'tobu-oyama', name: '大山', lineId: 'tobu-tojo', lon: 139.7270, lat: 35.7510 },
    { id: 'tobu-naka-itabashi', name: '中板橋', lineId: 'tobu-tojo', lon: 139.7330, lat: 35.7560 },
    { id: 'tobu-tokiwadai', name: 'ときわ台', lineId: 'tobu-tojo', lon: 139.7390, lat: 35.7610 },
    { id: 'tobu-kami-itabashi', name: '上板橋', lineId: 'tobu-tojo', lon: 139.7450, lat: 35.7660 },
    { id: 'tobu-nerima', name: '東武練馬', lineId: 'tobu-tojo', lon: 139.7520, lat: 35.7710 },
    { id: 'tobu-shimo-akatsuka', name: '下赤塚', lineId: 'tobu-tojo', lon: 139.7580, lat: 35.7750 },
    { id: 'tobu-narimasu', name: '成増', lineId: 'tobu-tojo', lon: 139.7640, lat: 35.7800 },
  ],
}
