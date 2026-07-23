import type { Line } from '../../domain/types.ts'

// 小田急小田原線 都内区間8駅（新宿→狛江）。座標は WGS84。
// 県境（多摩川）手前で切り取り。座標は主要駅ベースの推定値（Pages で要目視確認）。
// 小田急新宿はJR新宿の西側（別位置）。
export const odakyuLine: Line = {
  id: 'odakyu',
  name: '小田急小田原線',
  color: '#0094d8',
  stations: [
    { id: 'oh01', name: '新宿', lineId: 'odakyu', lon: 139.6595, lat: 35.6900 },
    { id: 'oh02', name: '南新宿', lineId: 'odakyu', lon: 139.6550, lat: 35.6820 },
    { id: 'oh03', name: '参宮橋', lineId: 'odakyu', lon: 139.6485, lat: 35.6715 },
    { id: 'oh04', name: '代々木八幡', lineId: 'odakyu', lon: 139.6460, lat: 35.6655 },
    { id: 'oh05', name: '代々木上原', lineId: 'odakyu', lon: 139.6445, lat: 35.6555 },
    { id: 'oh06', name: '東北沢', lineId: 'odakyu', lon: 139.6415, lat: 35.6470 },
    { id: 'oh07', name: '和泉多摩川', lineId: 'odakyu', lon: 139.6380, lat: 35.6385 },
    { id: 'oh08', name: '狛江', lineId: 'odakyu', lon: 139.6350, lat: 35.6300 },
  ],
}
