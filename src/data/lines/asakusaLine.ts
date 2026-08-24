import type { Line } from '../../domain/types.ts'

// 都営浅草線 全18駅（西馬込→浅草の路線順、A01-A18）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=8019849, 3302734) の role=stop ノード（停車位置）から取得。
// 注: 築地市場(E-16)・汐留(E-19) は大江戸線の駅であり浅草線には存在しない。
// © OpenStreetMap contributors。
export const asakusaLine: Line = {
  id: 'asakusa',
  name: '都営浅草線',
  color: '#e8472e',
  category: 'toei',
  stations: [
    { id: 'nishimagome-asakusa', name: '西馬込', lineId: 'asakusa', lon: 139.7063115, lat: 35.5872987 },
    { id: 'magome-asakusa', name: '馬込', lineId: 'asakusa', lon: 139.711871, lat: 35.596806 },
    { id: 'nakanobu-asakusa', name: '中延', lineId: 'asakusa', lon: 139.713591, lat: 35.6052663 },
    { id: 'togoshi-asakusa', name: '戸越', lineId: 'asakusa', lon: 139.7162995, lat: 35.6145375 },
    { id: 'gotanda-asakusa', name: '五反田', lineId: 'asakusa', lon: 139.7241661, lat: 35.6271354 },
    { id: 'takanawadai-asakusa', name: '高輪台', lineId: 'asakusa', lon: 139.73033, lat: 35.6318096 },
    { id: 'sengakuji-asakusa', name: '泉岳寺', lineId: 'asakusa', lon: 139.7400421, lat: 35.6387926 },
    { id: 'mita-asakusa', name: '三田', lineId: 'asakusa', lon: 139.7476024, lat: 35.6471602 },
    { id: 'daimon-asakusa', name: '大門', lineId: 'asakusa', lon: 139.7546855, lat: 35.6569287 },
    { id: 'shinbashi-asakusa', name: '新橋', lineId: 'asakusa', lon: 139.7593717, lat: 35.6654162 },
    { id: 'higashiginza-asakusa', name: '東銀座', lineId: 'asakusa', lon: 139.7671628, lat: 35.6698939 },
    { id: 'takaracho-asakusa', name: '宝町', lineId: 'asakusa', lon: 139.7718655, lat: 35.67544 },
    { id: 'nihonbashi-asakusa', name: '日本橋', lineId: 'asakusa', lon: 139.775831, lat: 35.6819023 },
    { id: 'ningyocho-asakusa', name: '人形町', lineId: 'asakusa', lon: 139.7821612, lat: 35.6863228 },
    { id: 'higashinihonbashi-asakusa', name: '東日本橋', lineId: 'asakusa', lon: 139.7848622, lat: 35.6921262 },
    { id: 'asakusabashi-asakusa', name: '浅草橋', lineId: 'asakusa', lon: 139.7862521, lat: 35.697411 },
    { id: 'kuramae-asakusa', name: '蔵前', lineId: 'asakusa', lon: 139.7909413, lat: 35.7032372 },
    { id: 'asakusa-asakusa', name: '浅草', lineId: 'asakusa', lon: 139.7965559, lat: 35.7089843 },
  ],
}
