import type { Line } from '../../domain/types.ts'

// 東急田園都市線 8駅（渋谷→二子新地）。座標は WGS84。
// 東急田園都市線。都内は渋谷〜二子新地。高津以遠は川崎市・横浜市。
// 駅id は tokyu-denentoshi-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=9341815) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const tokyuDenentoshiLine: Line = {
  id: 'tokyu-denentoshi',
  name: '東急田園都市線',
  color: '#37b8c4',
  category: 'private',
  stations: [
    { id: 'tokyu-denentoshi-01', name: '渋谷', lineId: 'tokyu-denentoshi', lon: 139.7020856, lat: 35.6594567 },
    { id: 'tokyu-denentoshi-02', name: '池尻大橋', lineId: 'tokyu-denentoshi', lon: 139.6847968, lat: 35.6507439 },
    { id: 'tokyu-denentoshi-03', name: '三軒茶屋', lineId: 'tokyu-denentoshi', lon: 139.6712617, lat: 35.6435134 },
    { id: 'tokyu-denentoshi-04', name: '駒沢大学', lineId: 'tokyu-denentoshi', lon: 139.6612211, lat: 35.6331198 },
    { id: 'tokyu-denentoshi-05', name: '桜新町', lineId: 'tokyu-denentoshi', lon: 139.6453722, lat: 35.6317016 },
    { id: 'tokyu-denentoshi-06', name: '用賀', lineId: 'tokyu-denentoshi', lon: 139.6342048, lat: 35.6266155 },
    { id: 'tokyu-denentoshi-07', name: '二子玉川', lineId: 'tokyu-denentoshi', lon: 139.6269557, lat: 35.6116779 },
    { id: 'tokyu-denentoshi-08', name: '二子新地', lineId: 'tokyu-denentoshi', lon: 139.6226106, lat: 35.6071221 },
  ],
}
