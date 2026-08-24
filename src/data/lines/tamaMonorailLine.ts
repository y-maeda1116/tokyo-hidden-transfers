import type { Line } from '../../domain/types.ts'

// 多摩都市モノレール線 19駅（上北台→多摩センター）。座標は WGS84。
// 多摩都市モノレール線。上北台→多摩センター、全駅都内（多摩地域）。第三セクター。
// 駅id は tama-monorail-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=3417185) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const tamaMonorailLine: Line = {
  id: 'tama-monorail',
  name: '多摩都市モノレール線',
  color: '#6f94ad',
  category: 'other',
  stations: [
    { id: 'tama-monorail-01', name: '上北台', lineId: 'tama-monorail', lon: 139.4158777, lat: 35.7458325 },
    { id: 'tama-monorail-02', name: '桜街道', lineId: 'tama-monorail', lon: 139.4166675, lat: 35.7390734 },
    { id: 'tama-monorail-03', name: '玉川上水', lineId: 'tama-monorail', lon: 139.417897, lat: 35.732241 },
    { id: 'tama-monorail-04', name: '砂川七番', lineId: 'tama-monorail', lon: 139.4181508, lat: 35.7233956 },
    { id: 'tama-monorail-05', name: '泉体育館', lineId: 'tama-monorail', lon: 139.4195844, lat: 35.7187878 },
    { id: 'tama-monorail-06', name: '立飛', lineId: 'tama-monorail', lon: 139.4171751, lat: 35.7143964 },
    { id: 'tama-monorail-07', name: '高松', lineId: 'tama-monorail', lon: 139.4132769, lat: 35.7101308 },
    { id: 'tama-monorail-08', name: '立川北', lineId: 'tama-monorail', lon: 139.4125175, lat: 35.6993986 },
    { id: 'tama-monorail-09', name: '立川南', lineId: 'tama-monorail', lon: 139.4126304, lat: 35.6961575 },
    { id: 'tama-monorail-10', name: '柴崎体育館', lineId: 'tama-monorail', lon: 139.4094393, lat: 35.6899661 },
    { id: 'tama-monorail-11', name: '甲州街道', lineId: 'tama-monorail', lon: 139.4092701, lat: 35.6782841 },
    { id: 'tama-monorail-12', name: '万願寺', lineId: 'tama-monorail', lon: 139.4200822, lat: 35.6712295 },
    { id: 'tama-monorail-13', name: '高幡不動', lineId: 'tama-monorail', lon: 139.4151774, lat: 35.6612907 },
    { id: 'tama-monorail-14', name: '程久保', lineId: 'tama-monorail', lon: 139.4108443, lat: 35.6552783 },
    { id: 'tama-monorail-15', name: '多摩動物公園', lineId: 'tama-monorail', lon: 139.4037584, lat: 35.6486657 },
    { id: 'tama-monorail-16', name: '中央大学・明星大学', lineId: 'tama-monorail', lon: 139.4087841, lat: 35.641901 },
    { id: 'tama-monorail-17', name: '大塚・帝京大学', lineId: 'tama-monorail', lon: 139.4164877, lat: 35.6369051 },
    { id: 'tama-monorail-18', name: '松が谷', lineId: 'tama-monorail', lon: 139.4221066, lat: 35.6318247 },
    { id: 'tama-monorail-19', name: '多摩センター', lineId: 'tama-monorail', lon: 139.4229065, lat: 35.6239538 },
  ],
}
