import type { Line } from '../../domain/types.ts'

// 宇都宮線 4駅（赤羽→東京）。座標は WGS84。
// JR宇都宮線（上野東京ライン）。都内は東京・上野・尾久・赤羽。大宮以遠は埼玉。
// 駅id は utsunomiya-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=12213561) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const utsunomiyaLine: Line = {
  id: 'utsunomiya',
  name: '宇都宮線',
  color: '#e87a2c',
  category: 'jr',
  stations: [
    { id: 'utsunomiya-01', name: '赤羽', lineId: 'utsunomiya', lon: 139.720847, lat: 35.7781576 },
    { id: 'utsunomiya-02', name: '尾久', lineId: 'utsunomiya', lon: 139.7536899, lat: 35.7469489 },
    { id: 'utsunomiya-03', name: '上野', lineId: 'utsunomiya', lon: 139.7764768, lat: 35.7134394 },
    { id: 'utsunomiya-04', name: '東京', lineId: 'utsunomiya', lon: 139.7670127, lat: 35.6811486 },
  ],
}
