import type { Line } from '../../domain/types.ts'

// 京急本線 都内区間11駅（泉岳寺→京急蒲田、第一・第二京浜沿いに南下）。座標は WGS84。
// 県境（多摩川）手前で切り取り。
// 座標は OpenStreetMap の route relation (id=9498719, 1994313) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const keikyuLine: Line = {
  id: 'keikyu',
  name: '京急本線',
  color: '#e60012',
  category: 'private',
  stations: [
    { id: 'kk01', name: '泉岳寺', lineId: 'keikyu', lon: 139.7398984, lat: 35.6387045 },
    { id: 'kk02', name: '品川', lineId: 'keikyu', lon: 139.7380364, lat: 35.6280603 },
    { id: 'kk03', name: '北品川', lineId: 'keikyu', lon: 139.7393068, lat: 35.6223469 },
    { id: 'kk04', name: '新馬場', lineId: 'keikyu', lon: 139.7413888, lat: 35.6169493 },
    { id: 'kk05', name: '青物横丁', lineId: 'keikyu', lon: 139.7430985, lat: 35.6088763 },
    { id: 'kk06', name: '鮫洲', lineId: 'keikyu', lon: 139.7421817, lat: 35.605055 },
    { id: 'kk07', name: '立会川', lineId: 'keikyu', lon: 139.7389638, lat: 35.5987033 },
    { id: 'kk08', name: '大森海岸', lineId: 'keikyu', lon: 139.7354165, lat: 35.5876946 },
    { id: 'kk09', name: '平和島', lineId: 'keikyu', lon: 139.7349883, lat: 35.578712 },
    { id: 'kk10', name: '梅屋敷', lineId: 'keikyu', lon: 139.7283857, lat: 35.5669594 },
    { id: 'kk11', name: '京急蒲田', lineId: 'keikyu', lon: 139.7240568, lat: 35.5613646 },
  ],
}
