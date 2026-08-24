import type { Line } from '../../domain/types.ts'

// 東急東横線 都内区間9駅（渋谷→多摩川）。座標は WGS84。
// 多摩川（県境）まで。
// 座標は OpenStreetMap の route relation (id=1947536, 9288982) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const toyokoLine: Line = {
  id: 'toyoko',
  name: '東急東横線',
  color: '#fad000',
  category: 'private',
  stations: [
    { id: 'ty01', name: '渋谷', lineId: 'toyoko', lon: 139.7027222, lat: 35.6586094 },
    { id: 'ty02', name: '代官山', lineId: 'toyoko', lon: 139.7032756, lat: 35.6481373 },
    { id: 'ty03', name: '中目黒', lineId: 'toyoko', lon: 139.6989507, lat: 35.644085 },
    { id: 'ty04', name: '祐天寺', lineId: 'toyoko', lon: 139.6910422, lat: 35.6375748 },
    { id: 'ty05', name: '学芸大学', lineId: 'toyoko', lon: 139.6852812, lat: 35.6289474 },
    { id: 'ty06', name: '都立大学', lineId: 'toyoko', lon: 139.6761727, lat: 35.6175561 },
    { id: 'ty07', name: '自由が丘', lineId: 'toyoko', lon: 139.668826, lat: 35.6075666 },
    { id: 'ty08', name: '田園調布', lineId: 'toyoko', lon: 139.6672836, lat: 35.596893 },
    { id: 'ty09', name: '多摩川', lineId: 'toyoko', lon: 139.668669, lat: 35.5896082 },
  ],
}
