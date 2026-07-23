import type { Line } from '../../domain/types.ts'

// 東急東横線 都内区間9駅（渋谷→多摩川）。座標は WGS84。
// 多摩川（県境）まで。座標は主要駅ベースの推定値（Pages で要目視確認）。
export const toyokoLine: Line = {
  id: 'toyoko',
  name: '東急東横線',
  color: '#fad000',
  stations: [
    { id: 'ty01', name: '渋谷', lineId: 'toyoko', lon: 139.7016, lat: 35.6585 },
    { id: 'ty02', name: '代官山', lineId: 'toyoko', lon: 139.7030, lat: 35.6510 },
    { id: 'ty03', name: '中目黒', lineId: 'toyoko', lon: 139.6988, lat: 35.6441 },
    { id: 'ty04', name: '祐天寺', lineId: 'toyoko', lon: 139.6710, lat: 35.6375 },
    { id: 'ty05', name: '学芸大学', lineId: 'toyoko', lon: 139.6680, lat: 35.6325 },
    { id: 'ty06', name: '都立大学', lineId: 'toyoko', lon: 139.6645, lat: 35.6260 },
    { id: 'ty07', name: '自由が丘', lineId: 'toyoko', lon: 139.6680, lat: 35.6075 },
    { id: 'ty08', name: '田園調布', lineId: 'toyoko', lon: 139.6645, lat: 35.5955 },
    { id: 'ty09', name: '多摩川', lineId: 'toyoko', lon: 139.6700, lat: 35.5865 },
  ],
}
