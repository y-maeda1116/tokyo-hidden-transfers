import type { Line } from '../../domain/types.ts'

// 東急世田谷線 10駅（三軒茶屋→下高井戸）。座標は WGS84。
// 東急世田谷線（路面電車）。三軒茶屋→下高井戸、全駅世田谷区。
// 駅id は tokyu-setagaya-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=7215409) のメンバー順序どおりの停車位置から取得。
// mode='tram': 路面電車。描画は rail と同幅。
// © OpenStreetMap contributors。
export const tokyuSetagayaLine: Line = {
  id: 'tokyu-setagaya',
  name: '東急世田谷線',
  color: '#f6c15e',
  mode: 'tram',
  category: 'private',
  stations: [
    { id: 'tokyu-setagaya-01', name: '三軒茶屋', lineId: 'tokyu-setagaya', lon: 139.6690322, lat: 35.6440902, mode: 'tram' },
    { id: 'tokyu-setagaya-02', name: '西太子堂', lineId: 'tokyu-setagaya', lon: 139.6661849, lat: 35.644615, mode: 'tram' },
    { id: 'tokyu-setagaya-03', name: '若林', lineId: 'tokyu-setagaya', lon: 139.6596987, lat: 35.6459127, mode: 'tram' },
    { id: 'tokyu-setagaya-04', name: '松陰神社前', lineId: 'tokyu-setagaya', lon: 139.655068, lat: 35.6439039, mode: 'tram' },
    { id: 'tokyu-setagaya-05', name: '世田谷', lineId: 'tokyu-setagaya', lon: 139.6506381, lat: 35.6434817, mode: 'tram' },
    { id: 'tokyu-setagaya-06', name: '上町', lineId: 'tokyu-setagaya', lon: 139.6470482, lat: 35.6431876, mode: 'tram' },
    { id: 'tokyu-setagaya-07', name: '宮の坂', lineId: 'tokyu-setagaya', lon: 139.6449936, lat: 35.647922, mode: 'tram' },
    { id: 'tokyu-setagaya-08', name: '山下', lineId: 'tokyu-setagaya', lon: 139.6464961, lat: 35.6538727, mode: 'tram' },
    { id: 'tokyu-setagaya-09', name: '松原', lineId: 'tokyu-setagaya', lon: 139.6419563, lat: 35.6602406, mode: 'tram' },
    { id: 'tokyu-setagaya-10', name: '下高井戸', lineId: 'tokyu-setagaya', lon: 139.6412157, lat: 35.6661118, mode: 'tram' },
  ],
}
