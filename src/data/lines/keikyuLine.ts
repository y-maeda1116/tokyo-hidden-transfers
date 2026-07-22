import type { Line } from '../../domain/types.ts'

// 京急本線 都内区間11駅（泉岳寺→京急蒲田、第一・第二京浜沿いに南下）。座標は WGS84。
// 県境（多摩川）手前で切り取り。座標は主要駅ベースの推定値（Pages で要目視確認）。
export const keikyuLine: Line = {
  id: 'keikyu',
  name: '京急本線',
  color: '#e60012',
  stations: [
    { id: 'kk01', name: '泉岳寺', lineId: 'keikyu', lon: 139.7395, lat: 35.6378 },
    { id: 'kk02', name: '品川', lineId: 'keikyu', lon: 139.7400, lat: 35.6286 },
    { id: 'kk03', name: '北品川', lineId: 'keikyu', lon: 139.7355, lat: 35.6245 },
    { id: 'kk04', name: '新馬場', lineId: 'keikyu', lon: 139.7315, lat: 35.6200 },
    { id: 'kk05', name: '青物横丁', lineId: 'keikyu', lon: 139.7275, lat: 35.6135 },
    { id: 'kk06', name: '鮫洲', lineId: 'keikyu', lon: 139.7240, lat: 35.6075 },
    { id: 'kk07', name: '立会川', lineId: 'keikyu', lon: 139.7210, lat: 35.6015 },
    { id: 'kk08', name: '大森海岸', lineId: 'keikyu', lon: 139.7185, lat: 35.5960 },
    { id: 'kk09', name: '平和島', lineId: 'keikyu', lon: 139.7160, lat: 35.5895 },
    { id: 'kk10', name: '梅屋敷', lineId: 'keikyu', lon: 139.7190, lat: 35.5830 },
    { id: 'kk11', name: '京急蒲田', lineId: 'keikyu', lon: 139.7215, lat: 35.5645 },
  ],
}
