import type { Line } from '../../domain/types.ts'

// 東武スカイツリーライン（伊勢崎線）都内区間（浅草→北千住）。
// 座標は主要駅ベースの推定値（Pages で要目視確認）。
export const tobuSkytreeLine: Line = {
  id: 'tobu-skytree',
  name: '東武スカイツリーライン',
  color: '#e87400',
  category: 'private',
  stations: [
    { id: 'tobu-asakusa', name: '浅草', lineId: 'tobu-skytree', lon: 139.7944, lat: 35.7115 },
    { id: 'tobu-skytree-stn', name: '東京スカイツリー', lineId: 'tobu-skytree', lon: 139.8108, lat: 35.7100 },
    { id: 'tobu-hikifune', name: '曳舟', lineId: 'tobu-skytree', lon: 139.8200, lat: 35.7200 },
    { id: 'tobu-kanegafuchi', name: '鐘ヶ淵', lineId: 'tobu-skytree', lon: 139.8290, lat: 35.7280 },
    { id: 'tobu-horikiri', name: '堀切', lineId: 'tobu-skytree', lon: 139.8350, lat: 35.7330 },
    { id: 'tobu-ushida', name: '牛田', lineId: 'tobu-skytree', lon: 139.8390, lat: 35.7250 },
    { id: 'tobu-kitasenju', name: '北千住', lineId: 'tobu-skytree', lon: 139.8040, lat: 35.7440 },
  ],
}
