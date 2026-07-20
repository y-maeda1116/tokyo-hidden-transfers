import type { Line } from '../../domain/types.ts'

// 東京メトロ副都心線 全16駅（F01和光市→F16渋谷）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=5375678, 和光市→渋谷) の
// role=stop ノード（停車位置）から取得。© OpenStreetMap contributors。
// 注: 和光市〜小竹向原は有楽町線と並走（別ホーム）。急行/快速は一部駅を通過するが、
// 本データは全駅停車の relation に基づく16駅。
export const fukutoshinLine: Line = {
  id: 'fukutoshin',
  name: '東京メトロ副都心線',
  color: '#9c5e31',
  stations: [
    { id: 'f01', name: '和光市', lineId: 'fukutoshin', lon: 139.6128678, lat: 35.7883529 },
    { id: 'f02', name: '地下鉄成増', lineId: 'fukutoshin', lon: 139.6313339, lat: 35.776704 },
    { id: 'f03', name: '地下鉄赤塚', lineId: 'fukutoshin', lon: 139.6441677, lat: 35.769971 },
    { id: 'f04', name: '平和台', lineId: 'fukutoshin', lon: 139.6542458, lat: 35.7576942 },
    { id: 'f05', name: '氷川台', lineId: 'fukutoshin', lon: 139.6650785, lat: 35.7498601 },
    { id: 'f06', name: '小竹向原', lineId: 'fukutoshin', lon: 139.6806313, lat: 35.7428773 },
    { id: 'f07', name: '千川', lineId: 'fukutoshin', lon: 139.689497, lat: 35.7382898 },
    { id: 'f08', name: '要町', lineId: 'fukutoshin', lon: 139.6987138, lat: 35.7332813 },
    { id: 'f09', name: '池袋', lineId: 'fukutoshin', lon: 139.7089976, lat: 35.7312233 },
    { id: 'f10', name: '雑司が谷', lineId: 'fukutoshin', lon: 139.7147443, lat: 35.7201652 },
    { id: 'f11', name: '西早稲田', lineId: 'fukutoshin', lon: 139.7090644, lat: 35.7079175 },
    { id: 'f12', name: '東新宿', lineId: 'fukutoshin', lon: 139.7077279, lat: 35.6989445 },
    { id: 'f13', name: '新宿三丁目', lineId: 'fukutoshin', lon: 139.7048163, lat: 35.6906889 },
    { id: 'f14', name: '北参道', lineId: 'fukutoshin', lon: 139.7054958, lat: 35.6784821 },
    { id: 'f15', name: '明治神宮前〈原宿〉', lineId: 'fukutoshin', lon: 139.7053934, lat: 35.668396 },
    { id: 'f16', name: '渋谷', lineId: 'fukutoshin', lon: 139.7027508, lat: 35.6586186 },
  ],
}
