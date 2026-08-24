import type { Line } from '../../domain/types.ts'

// 京急空港線 7駅（京急蒲田→羽田空港第1・第2ターミナル）。座標は WGS84。
// 京急空港線。京急蒲田から分岐し羽田空港へ。全駅都内（大田区）。京急本線と同じ社色。
// 駅id は keikyu-airport-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=3340251) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const keikyuAirportLine: Line = {
  id: 'keikyu-airport',
  name: '京急空港線',
  color: '#e60012',
  category: 'private',
  stations: [
    { id: 'keikyu-airport-01', name: '京急蒲田', lineId: 'keikyu-airport', lon: 139.7242378, lat: 35.5612988 },
    { id: 'keikyu-airport-02', name: '糀谷', lineId: 'keikyu-airport', lon: 139.7294831, lat: 35.5547134 },
    { id: 'keikyu-airport-03', name: '大鳥居', lineId: 'keikyu-airport', lon: 139.7397097, lat: 35.5524778 },
    { id: 'keikyu-airport-04', name: '穴守稲荷', lineId: 'keikyu-airport', lon: 139.7467626, lat: 35.5503295 },
    { id: 'keikyu-airport-05', name: '天空橋', lineId: 'keikyu-airport', lon: 139.7547051, lat: 35.5481306 },
    { id: 'keikyu-airport-06', name: '羽田空港第3ターミナル', lineId: 'keikyu-airport', lon: 139.7670419, lat: 35.5450307 },
    { id: 'keikyu-airport-07', name: '羽田空港第1・第2ターミナル', lineId: 'keikyu-airport', lon: 139.7860523, lat: 35.549901 },
  ],
}
