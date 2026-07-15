import type { Line } from '../../domain/types.ts'

// 都営浅草線 全18駅（西馬込→浅草の路線順、A01-A18）。座標は WGS84（経度/緯度）。
// 西馬込〜高輪台は NAVITIME の確定座標。それ以外は公開データと路線形状を
// 基準にした推定値（地図表示で要微修正）。
// 注: 築地市場(E-16)・汐留(E-19) は大江戸線の駅であり浅草線には存在しない。
export const asakusaLine: Line = {
  id: 'asakusa',
  name: '都営浅草線',
  color: '#e8472e',
  stations: [
    { id: 'nishimagome-asakusa', name: '西馬込', lineId: 'asakusa', lon: 139.706189, lat: 35.587437 },
    { id: 'magome-asakusa', name: '馬込', lineId: 'asakusa', lon: 139.711861, lat: 35.596593 },
    { id: 'nakanobu-asakusa', name: '中延', lineId: 'asakusa', lon: 139.7189, lat: 35.6204 },
    { id: 'togoshi-asakusa', name: '戸越', lineId: 'asakusa', lon: 139.716404, lat: 35.614582 },
    { id: 'gotanda-asakusa', name: '五反田', lineId: 'asakusa', lon: 139.72358, lat: 35.626258 },
    { id: 'takanawadai-asakusa', name: '高輪台', lineId: 'asakusa', lon: 139.730418, lat: 35.631745 },
    { id: 'sengakuji-asakusa', name: '泉岳寺', lineId: 'asakusa', lon: 139.7395, lat: 35.6378 },
    { id: 'mita-asakusa', name: '三田', lineId: 'asakusa', lon: 139.747, lat: 35.6464 },
    { id: 'daimon-asakusa', name: '大門', lineId: 'asakusa', lon: 139.7567, lat: 35.6595 },
    { id: 'shinbashi-asakusa', name: '新橋', lineId: 'asakusa', lon: 139.7681, lat: 35.6655 },
    { id: 'higashiginza-asakusa', name: '東銀座', lineId: 'asakusa', lon: 139.7695, lat: 35.6689 },
    { id: 'takaracho-asakusa', name: '宝町', lineId: 'asakusa', lon: 139.7692, lat: 35.6753 },
    { id: 'nihonbashi-asakusa', name: '日本橋', lineId: 'asakusa', lon: 139.7745, lat: 35.6825 },
    { id: 'ningyocho-asakusa', name: '人形町', lineId: 'asakusa', lon: 139.7836, lat: 35.6868 },
    { id: 'higashinihonbashi-asakusa', name: '東日本橋', lineId: 'asakusa', lon: 139.7865, lat: 35.6947 },
    { id: 'asakusabashi-asakusa', name: '浅草橋', lineId: 'asakusa', lon: 139.7876, lat: 35.7019 },
    { id: 'kuramae-asakusa', name: '蔵前', lineId: 'asakusa', lon: 139.7955, lat: 35.7116 },
    { id: 'asakusa-asakusa', name: '浅草', lineId: 'asakusa', lon: 139.8059, lat: 35.7119 },
  ],
}
