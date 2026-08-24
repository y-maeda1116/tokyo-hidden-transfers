import type { Line } from '../../domain/types.ts'

// 中央線快速 24駅（東京→高尾）。座標は WGS84。
// JR中央線快速。東京→高尾、全駅東京都内。
// 駅id は chuo-rapid-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=10363876) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const chuoRapidLine: Line = {
  id: 'chuo-rapid',
  name: '中央線快速',
  color: '#f15a22',
  category: 'jr',
  stations: [
    { id: 'chuo-rapid-01', name: '東京', lineId: 'chuo-rapid', lon: 139.7662304, lat: 35.6813234 },
    { id: 'chuo-rapid-02', name: '神田', lineId: 'chuo-rapid', lon: 139.7706986, lat: 35.6918462 },
    { id: 'chuo-rapid-03', name: '御茶ノ水', lineId: 'chuo-rapid', lon: 139.7649795, lat: 35.6994836 },
    { id: 'chuo-rapid-04', name: '四ツ谷', lineId: 'chuo-rapid', lon: 139.7305436, lat: 35.6859092 },
    { id: 'chuo-rapid-05', name: '新宿', lineId: 'chuo-rapid', lon: 139.700465, lat: 35.6889921 },
    { id: 'chuo-rapid-06', name: '中野', lineId: 'chuo-rapid', lon: 139.6655298, lat: 35.7059464 },
    { id: 'chuo-rapid-07', name: '高円寺', lineId: 'chuo-rapid', lon: 139.649952, lat: 35.7053524 },
    { id: 'chuo-rapid-08', name: '阿佐ケ谷', lineId: 'chuo-rapid', lon: 139.6353596, lat: 35.7048985 },
    { id: 'chuo-rapid-09', name: '荻窪', lineId: 'chuo-rapid', lon: 139.6202324, lat: 35.7044988 },
    { id: 'chuo-rapid-10', name: '西荻窪', lineId: 'chuo-rapid', lon: 139.5995807, lat: 35.7038106 },
    { id: 'chuo-rapid-11', name: '吉祥寺', lineId: 'chuo-rapid', lon: 139.5802182, lat: 35.703155 },
    { id: 'chuo-rapid-12', name: '三鷹', lineId: 'chuo-rapid', lon: 139.5609304, lat: 35.7026704 },
    { id: 'chuo-rapid-13', name: '武蔵境', lineId: 'chuo-rapid', lon: 139.5440806, lat: 35.7021106 },
    { id: 'chuo-rapid-14', name: '東小金井', lineId: 'chuo-rapid', lon: 139.5240574, lat: 35.7015223 },
    { id: 'chuo-rapid-15', name: '武蔵小金井', lineId: 'chuo-rapid', lon: 139.5067904, lat: 35.7010071 },
    { id: 'chuo-rapid-16', name: '国分寺', lineId: 'chuo-rapid', lon: 139.4803601, lat: 35.700082 },
    { id: 'chuo-rapid-17', name: '西国分寺', lineId: 'chuo-rapid', lon: 139.4657359, lat: 35.6997146 },
    { id: 'chuo-rapid-18', name: '国立', lineId: 'chuo-rapid', lon: 139.4465317, lat: 35.6992218 },
    { id: 'chuo-rapid-19', name: '立川', lineId: 'chuo-rapid', lon: 139.4135512, lat: 35.6977712 },
    { id: 'chuo-rapid-20', name: '日野', lineId: 'chuo-rapid', lon: 139.3937051, lat: 35.6789963 },
    { id: 'chuo-rapid-21', name: '豊田', lineId: 'chuo-rapid', lon: 139.381522, lat: 35.65952 },
    { id: 'chuo-rapid-22', name: '八王子', lineId: 'chuo-rapid', lon: 139.3394695, lat: 35.655349 },
    { id: 'chuo-rapid-23', name: '西八王子', lineId: 'chuo-rapid', lon: 139.3124422, lat: 35.6565139 },
    { id: 'chuo-rapid-24', name: '高尾', lineId: 'chuo-rapid', lon: 139.2824497, lat: 35.6422122 },
  ],
}
