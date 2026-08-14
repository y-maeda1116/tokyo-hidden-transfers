import type { Line } from '../../domain/types.ts'

// 小田急小田原線 都内区間8駅（新宿→狛江）。座標は WGS84。
// 県境（多摩川）手前で切り取り。
// 座標は OpenStreetMap の railway=station ノード（駅代表点）から取得。
// 小田急の route relation (id=1942963) は線路形状のみで stop ロールを持たないため、
// 都内駅名で railway=station を検索して取得（stop 位置より数十mの差あり得る）。
// © OpenStreetMap contributors。
// 小田急新宿はJR新宿の西側（別位置）。
export const odakyuLine: Line = {
  id: 'odakyu',
  name: '小田急小田原線',
  color: '#0094d8',
  category: 'private',
  stations: [
    { id: 'oh01', name: '新宿', lineId: 'odakyu', lon: 139.7006009, lat: 35.6922273 },
    { id: 'oh02', name: '南新宿', lineId: 'odakyu', lon: 139.698857, lat: 35.6837073 },
    { id: 'oh03', name: '参宮橋', lineId: 'odakyu', lon: 139.6936737, lat: 35.6787414 },
    { id: 'oh04', name: '代々木八幡', lineId: 'odakyu', lon: 139.6888398, lat: 35.6696211 },
    { id: 'oh05', name: '代々木上原', lineId: 'odakyu', lon: 139.6797884, lat: 35.6690082 },
    { id: 'oh06', name: '東北沢', lineId: 'odakyu', lon: 139.6724982, lat: 35.6651291 },
    { id: 'oh07', name: '狛江', lineId: 'odakyu', lon: 139.5774238, lat: 35.632315 },
    { id: 'oh08', name: '和泉多摩川', lineId: 'odakyu', lon: 139.5737269, lat: 35.6275123 },
  ],
}
