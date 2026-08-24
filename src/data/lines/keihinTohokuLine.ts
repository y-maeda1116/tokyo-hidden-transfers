import type { Line } from '../../domain/types.ts'

// 京浜東北線 22駅（赤羽→蒲田）。座標は WGS84。
// JR京浜東北線。都内区間（赤羽→蒲田）のみ。大宮側と川崎以遠は埼玉・神奈川。
// 駅id は keihin-tohoku-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=5195691) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const keihinTohokuLine: Line = {
  id: 'keihin-tohoku',
  name: '京浜東北線',
  color: '#00b2e5',
  category: 'jr',
  stations: [
    { id: 'keihin-tohoku-01', name: '赤羽', lineId: 'keihin-tohoku', lon: 139.7210464, lat: 35.7782533 },
    { id: 'keihin-tohoku-02', name: '東十条', lineId: 'keihin-tohoku', lon: 139.7270084, lat: 35.7638994 },
    { id: 'keihin-tohoku-03', name: '王子', lineId: 'keihin-tohoku', lon: 139.7383102, lat: 35.7523766 },
    { id: 'keihin-tohoku-04', name: '上中里', lineId: 'keihin-tohoku', lon: 139.7470447, lat: 35.7466453 },
    { id: 'keihin-tohoku-05', name: '田端', lineId: 'keihin-tohoku', lon: 139.7618169, lat: 35.737452 },
    { id: 'keihin-tohoku-06', name: '西日暮里', lineId: 'keihin-tohoku', lon: 139.7668123, lat: 35.7322698 },
    { id: 'keihin-tohoku-07', name: '日暮里', lineId: 'keihin-tohoku', lon: 139.7705203, lat: 35.7280486 },
    { id: 'keihin-tohoku-08', name: '鶯谷', lineId: 'keihin-tohoku', lon: 139.7780292, lat: 35.721775 },
    { id: 'keihin-tohoku-09', name: '上野', lineId: 'keihin-tohoku', lon: 139.7762651, lat: 35.7135261 },
    { id: 'keihin-tohoku-10', name: '御徒町', lineId: 'keihin-tohoku', lon: 139.7747651, lat: 35.7069374 },
    { id: 'keihin-tohoku-11', name: '秋葉原', lineId: 'keihin-tohoku', lon: 139.7731964, lat: 35.698354 },
    { id: 'keihin-tohoku-12', name: '神田', lineId: 'keihin-tohoku', lon: 139.7711284, lat: 35.6917404 },
    { id: 'keihin-tohoku-13', name: '東京', lineId: 'keihin-tohoku', lon: 139.766771, lat: 35.6812103 },
    { id: 'keihin-tohoku-14', name: '有楽町', lineId: 'keihin-tohoku', lon: 139.7631511, lat: 35.674857 },
    { id: 'keihin-tohoku-15', name: '新橋', lineId: 'keihin-tohoku', lon: 139.7582879, lat: 35.6661801 },
    { id: 'keihin-tohoku-16', name: '浜松町', lineId: 'keihin-tohoku', lon: 139.7571919, lat: 35.6550917 },
    { id: 'keihin-tohoku-17', name: '田町', lineId: 'keihin-tohoku', lon: 139.7477543, lat: 35.6456398 },
    { id: 'keihin-tohoku-18', name: '高輪ゲートウェイ', lineId: 'keihin-tohoku', lon: 139.7408146, lat: 35.6353519 },
    { id: 'keihin-tohoku-19', name: '品川', lineId: 'keihin-tohoku', lon: 139.7387253, lat: 35.6286682 },
    { id: 'keihin-tohoku-20', name: '大井町', lineId: 'keihin-tohoku', lon: 139.7349479, lat: 35.6063867 },
    { id: 'keihin-tohoku-21', name: '大森', lineId: 'keihin-tohoku', lon: 139.7279123, lat: 35.5884837 },
    { id: 'keihin-tohoku-22', name: '蒲田', lineId: 'keihin-tohoku', lon: 139.7159313, lat: 35.5619926 },
  ],
}
