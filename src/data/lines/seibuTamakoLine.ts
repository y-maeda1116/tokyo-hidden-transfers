import type { Line } from '../../domain/types.ts'

// 西武多摩湖線 7駅（国分寺→多摩湖）。座標は WGS84。
// 西武多摩湖線。国分寺→多摩湖、全駅都内（国分寺市・東大和市・武蔵村山市）。
// 駅id は seibu-tamako-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=1947331) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const seibuTamakoLine: Line = {
  id: 'seibu-tamako',
  name: '西武多摩湖線',
  color: '#9adbe0',
  category: 'private',
  stations: [
    { id: 'seibu-tamako-01', name: '国分寺', lineId: 'seibu-tamako', lon: 139.4793266, lat: 35.7011762 },
    { id: 'seibu-tamako-02', name: '一橋学園', lineId: 'seibu-tamako', lon: 139.4800781, lat: 35.7218063 },
    { id: 'seibu-tamako-03', name: '青梅街道', lineId: 'seibu-tamako', lon: 139.476615, lat: 35.7308104 },
    { id: 'seibu-tamako-04', name: '萩山', lineId: 'seibu-tamako', lon: 139.4770441, lat: 35.7407822 },
    { id: 'seibu-tamako-05', name: '八坂', lineId: 'seibu-tamako', lon: 139.4673399, lat: 35.7451277 },
    { id: 'seibu-tamako-06', name: '武蔵大和', lineId: 'seibu-tamako', lon: 139.4441025, lat: 35.7562572 },
    { id: 'seibu-tamako-07', name: '多摩湖', lineId: 'seibu-tamako', lon: 139.4425787, lat: 35.7659237 },
  ],
}
