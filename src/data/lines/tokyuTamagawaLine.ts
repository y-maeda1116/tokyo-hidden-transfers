import type { Line } from '../../domain/types.ts'

// 東急多摩川線 7駅（多摩川→蒲田）。座標は WGS84。
// 東急多摩川線。多摩川→蒲田、全駅都内（世田谷区・大田区）。
// 駅id は tokyu-tamagawa-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=9343886) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const tokyuTamagawaLine: Line = {
  id: 'tokyu-tamagawa',
  name: '東急多摩川線',
  color: '#a4bf3c',
  category: 'private',
  stations: [
    { id: 'tokyu-tamagawa-01', name: '多摩川', lineId: 'tokyu-tamagawa', lon: 139.6688552, lat: 35.5896403 },
    { id: 'tokyu-tamagawa-02', name: '沼部', lineId: 'tokyu-tamagawa', lon: 139.6730812, lat: 35.5827819 },
    { id: 'tokyu-tamagawa-03', name: '鵜の木', lineId: 'tokyu-tamagawa', lon: 139.6805847, lat: 35.5754772 },
    { id: 'tokyu-tamagawa-04', name: '下丸子', lineId: 'tokyu-tamagawa', lon: 139.685601, lat: 35.5714014 },
    { id: 'tokyu-tamagawa-05', name: '武蔵新田', lineId: 'tokyu-tamagawa', lon: 139.6924757, lat: 35.5678875 },
    { id: 'tokyu-tamagawa-06', name: '矢口渡', lineId: 'tokyu-tamagawa', lon: 139.7002662, lat: 35.5625937 },
    { id: 'tokyu-tamagawa-07', name: '蒲田', lineId: 'tokyu-tamagawa', lon: 139.7146729, lat: 35.5617009 },
  ],
}
