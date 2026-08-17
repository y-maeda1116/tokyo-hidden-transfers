import type { Line } from '../../domain/types.ts'

// 小田急小田原線 17駅（新宿→和泉多摩川）。座標は WGS84。
// 東京都内の全駅（世田谷区の地下区間含む）＋多摩川対岸の和泉多摩川（神奈川）まで。
// 駅id は小田急公式駅番号 OH01〜OH17 に対応。
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
    { id: 'oh07', name: '下北沢', lineId: 'odakyu', lon: 139.666822, lat: 35.6611356 },
    { id: 'oh08', name: '世田谷代田', lineId: 'odakyu', lon: 139.6615307, lat: 35.6582913 },
    { id: 'oh09', name: '梅ヶ丘', lineId: 'odakyu', lon: 139.6541274, lat: 35.6561754 },
    { id: 'oh10', name: '豪徳寺', lineId: 'odakyu', lon: 139.6468507, lat: 35.6535429 },
    { id: 'oh11', name: '経堂', lineId: 'odakyu', lon: 139.636679, lat: 35.6512791 },
    { id: 'oh12', name: '千歳船橋', lineId: 'odakyu', lon: 139.6238215, lat: 35.6473986 },
    { id: 'oh13', name: '祖師ヶ谷大蔵', lineId: 'odakyu', lon: 139.6097472, lat: 35.6432802 },
    { id: 'oh14', name: '成城学園前', lineId: 'odakyu', lon: 139.5984426, lat: 35.6399444 },
    { id: 'oh15', name: '喜多見', lineId: 'odakyu', lon: 139.5868713, lat: 35.6365293 },
    { id: 'oh16', name: '狛江', lineId: 'odakyu', lon: 139.5774238, lat: 35.632315 },
    { id: 'oh17', name: '和泉多摩川', lineId: 'odakyu', lon: 139.5737269, lat: 35.6275123 },
  ],
}
