import type { Line } from '../../domain/types.ts'

// 青梅線 25駅（立川→奥多摩）。座標は WGS84。
// JR青梅線。立川→奥多摩、全駅東京都内（多摩西部を含むため地図表示範囲に注意）。
// 駅id は ome-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=11814887) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const omeLine: Line = {
  id: 'ome',
  name: '青梅線',
  color: '#e8641e',
  category: 'jr',
  stations: [
    { id: 'ome-01', name: '立川', lineId: 'ome', lon: 139.4135506, lat: 35.6980787 },
    { id: 'ome-02', name: '西立川', lineId: 'ome', lon: 139.3935897, lat: 35.7034586 },
    { id: 'ome-03', name: '東中神', lineId: 'ome', lon: 139.3841065, lat: 35.7064476 },
    { id: 'ome-04', name: '中神', lineId: 'ome', lon: 139.3755065, lat: 35.7090889 },
    { id: 'ome-05', name: '昭島', lineId: 'ome', lon: 139.3608744, lat: 35.7135235 },
    { id: 'ome-06', name: '拝島', lineId: 'ome', lon: 139.3434833, lat: 35.7211908 },
    { id: 'ome-07', name: '牛浜', lineId: 'ome', lon: 139.3335638, lat: 35.7345804 },
    { id: 'ome-08', name: '福生', lineId: 'ome', lon: 139.3278175, lat: 35.742328 },
    { id: 'ome-09', name: '羽村', lineId: 'ome', lon: 139.3159656, lat: 35.7583304 },
    { id: 'ome-10', name: '小作', lineId: 'ome', lon: 139.3019098, lat: 35.7763022 },
    { id: 'ome-11', name: '河辺', lineId: 'ome', lon: 139.2845896, lat: 35.7844637 },
    { id: 'ome-12', name: '東青梅', lineId: 'ome', lon: 139.272536, lat: 35.7899487 },
    { id: 'ome-13', name: '青梅', lineId: 'ome', lon: 139.2583283, lat: 35.79041 },
    { id: 'ome-14', name: '宮ノ平', lineId: 'ome', lon: 139.2370287, lat: 35.7874947 },
    { id: 'ome-15', name: '日向和田', lineId: 'ome', lon: 139.2298103, lat: 35.7881925 },
    { id: 'ome-16', name: '石神前', lineId: 'ome', lon: 139.225246, lat: 35.7966509 },
    { id: 'ome-17', name: '二俣尾', lineId: 'ome', lon: 139.2159226, lat: 35.8042712 },
    { id: 'ome-18', name: '軍畑', lineId: 'ome', lon: 139.2076536, lat: 35.8076658 },
    { id: 'ome-19', name: '沢井', lineId: 'ome', lon: 139.1937545, lat: 35.8059112 },
    { id: 'ome-20', name: '御嶽', lineId: 'ome', lon: 139.1818845, lat: 35.8013884 },
    { id: 'ome-21', name: '川井', lineId: 'ome', lon: 139.164028, lat: 35.8137011 },
    { id: 'ome-22', name: '古里', lineId: 'ome', lon: 139.1516293, lat: 35.8162887 },
    { id: 'ome-23', name: '鳩ノ巣', lineId: 'ome', lon: 139.1287096, lat: 35.8151194 },
    { id: 'ome-24', name: '白丸', lineId: 'ome', lon: 139.1148337, lat: 35.8119675 },
    { id: 'ome-25', name: '奥多摩', lineId: 'ome', lon: 139.0968064, lat: 35.8094299 },
  ],
}
