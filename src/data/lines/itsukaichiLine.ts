import type { Line } from '../../domain/types.ts'

// 五日市線 7駅（拝島→武蔵五日市）。座標は WGS84。
// JR五日市線。拝島→武蔵五日市、全駅東京都内（あきる野市）。
// 駅id は itsukaichi-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=1984869) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const itsukaichiLine: Line = {
  id: 'itsukaichi',
  name: '五日市線',
  color: '#f2a1c1',
  category: 'jr',
  stations: [
    { id: 'itsukaichi-01', name: '拝島', lineId: 'itsukaichi', lon: 139.3434109, lat: 35.7211549 },
    { id: 'itsukaichi-02', name: '熊川', lineId: 'itsukaichi', lon: 139.3354099, lat: 35.7284669 },
    { id: 'itsukaichi-03', name: '東秋留', lineId: 'itsukaichi', lon: 139.3111937, lat: 35.7258724 },
    { id: 'itsukaichi-04', name: '秋川', lineId: 'itsukaichi', lon: 139.2866849, lat: 35.7280568 },
    { id: 'itsukaichi-05', name: '武蔵引田', lineId: 'itsukaichi', lon: 139.2700981, lat: 35.7297171 },
    { id: 'itsukaichi-06', name: '武蔵増戸', lineId: 'itsukaichi', lon: 139.2562005, lat: 35.7309564 },
    { id: 'itsukaichi-07', name: '武蔵五日市', lineId: 'itsukaichi', lon: 139.2279385, lat: 35.7322027 },
  ],
}
