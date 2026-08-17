import type { Line } from '../../domain/types.ts'

// 東武スカイツリーライン（伊勢崎線）都内区間11駅（浅草→谷塚）。座標は WGS84。
// 県境（埼玉・草加）手前で切り取り。梅島〜谷塚が北千住以遠の足立区内区間。
// 座標は OpenStreetMap の route relation (id=5392090, 9504526) の role=stop ノード（停車位置）から取得。
// 北千住は relation の stop 欠落のため railway=station ノードで補完。
// © OpenStreetMap contributors。
export const tobuSkytreeLine: Line = {
  id: 'tobu-skytree',
  name: '東武スカイツリーライン',
  color: '#e87400',
  category: 'private',
  stations: [
    { id: 'tobu-asakusa', name: '浅草', lineId: 'tobu-skytree', lon: 139.7983811, lat: 35.7121581 },
    { id: 'tobu-skytree-stn', name: '東京スカイツリー', lineId: 'tobu-skytree', lon: 139.8110139, lat: 35.7107044 },
    { id: 'tobu-hikifune', name: '曳舟', lineId: 'tobu-skytree', lon: 139.816812, lat: 35.7183044 },
    { id: 'tobu-kanegafuchi', name: '鐘ヶ淵', lineId: 'tobu-skytree', lon: 139.8205853, lat: 35.733746 },
    { id: 'tobu-horikiri', name: '堀切', lineId: 'tobu-skytree', lon: 139.8175959, lat: 35.7433283 },
    { id: 'tobu-ushida', name: '牛田', lineId: 'tobu-skytree', lon: 139.8121201, lat: 35.744676 },
    { id: 'tobu-kitasenju', name: '北千住', lineId: 'tobu-skytree', lon: 139.8050915, lat: 35.7495401 },
    { id: 'tobu-umejima', name: '梅島', lineId: 'tobu-skytree', lon: 139.7980187, lat: 35.7723245 },
    { id: 'tobu-nishiarai', name: '西新井', lineId: 'tobu-skytree', lon: 139.7903751, lat: 35.7772881 },
    { id: 'tobu-takenotsuka', name: '竹ノ塚', lineId: 'tobu-skytree', lon: 139.7907791, lat: 35.7944796 },
    { id: 'tobu-yatsuka', name: '谷塚', lineId: 'tobu-skytree', lon: 139.8012068, lat: 35.8142095 },
  ],
}
