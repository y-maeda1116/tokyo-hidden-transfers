import type { Line } from '../../domain/types.ts'

// 都電荒川線 早稲田→大塚駅前（16停留所）。全36停留所のうち振替（大塚）までの主要区間。
// すべて東京都内。座標は主要停留所ベースの推定値（Pages で要目視確認）。
// 路線形状が北回り（早稲田→王子→飛鳥山）から南へ折り返すため、停留所間の推定誤差が大きめ。
export const todenArakawaLine: Line = {
  id: 'toden-arakawa',
  name: '都電荒川線',
  color: '#86b853',
  stations: [
    { id: 'sa01', name: '早稲田', lineId: 'toden-arakawa', lon: 139.7170, lat: 35.7085 },
    { id: 'sa02', name: '面影橋', lineId: 'toden-arakawa', lon: 139.7185, lat: 35.7145 },
    { id: 'sa03', name: '学習院下', lineId: 'toden-arakawa', lon: 139.7198, lat: 35.7205 },
    { id: 'sa04', name: '鬼子母神前', lineId: 'toden-arakawa', lon: 139.7215, lat: 35.7265 },
    { id: 'sa05', name: '都電雑司ヶ谷', lineId: 'toden-arakawa', lon: 139.7240, lat: 35.7315 },
    { id: 'sa06', name: '庚申塚', lineId: 'toden-arakawa', lon: 139.7290, lat: 35.7375 },
    { id: 'sa07', name: '新庚申塚', lineId: 'toden-arakawa', lon: 139.7320, lat: 35.7410 },
    { id: 'sa08', name: '王子駅前', lineId: 'toden-arakawa', lon: 139.7370, lat: 35.7495 },
    { id: 'sa09', name: '飛鳥山', lineId: 'toden-arakawa', lon: 139.7400, lat: 35.7530 },
    { id: 'sa10', name: '滝野川一丁目', lineId: 'toden-arakawa', lon: 139.7430, lat: 35.7565 },
    { id: 'sa11', name: '西ヶ原四丁目', lineId: 'toden-arakawa', lon: 139.7455, lat: 35.7495 },
    { id: 'sa12', name: '新富士見', lineId: 'toden-arakawa', lon: 139.7425, lat: 35.7435 },
    { id: 'sa13', name: '熊野前', lineId: 'toden-arakawa', lon: 139.7395, lat: 35.7385 },
    { id: 'sa14', name: '宮ノ前', lineId: 'toden-arakawa', lon: 139.7360, lat: 35.7355 },
    { id: 'sa15', name: '巣鴨新田', lineId: 'toden-arakawa', lon: 139.7330, lat: 35.7335 },
    { id: 'sa16', name: '大塚駅前', lineId: 'toden-arakawa', lon: 139.7290, lat: 35.7317 },
  ],
}
