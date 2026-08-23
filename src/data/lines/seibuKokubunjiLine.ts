import type { Line } from '../../domain/types.ts'

// 西武国分寺線 5駅（東村山→国分寺）。座標は WGS84。
// 西武国分寺線。東村山→国分寺、全駅都内（東村山市・国分寺市）。
// 駅id は seibu-kokubunji-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=11722738) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const seibuKokubunjiLine: Line = {
  id: 'seibu-kokubunji',
  name: '西武国分寺線',
  color: '#4dbdbd',
  category: 'private',
  stations: [
    { id: 'seibu-kokubunji-01', name: '東村山', lineId: 'seibu-kokubunji', lon: 139.4657039, lat: 35.7599856 },
    { id: 'seibu-kokubunji-02', name: '小川', lineId: 'seibu-kokubunji', lon: 139.4635664, lat: 35.7374066 },
    { id: 'seibu-kokubunji-03', name: '鷹の台', lineId: 'seibu-kokubunji', lon: 139.4612069, lat: 35.723362 },
    { id: 'seibu-kokubunji-04', name: '恋ヶ窪', lineId: 'seibu-kokubunji', lon: 139.4640618, lat: 35.7113234 },
    { id: 'seibu-kokubunji-05', name: '国分寺', lineId: 'seibu-kokubunji', lon: 139.4803499, lat: 35.7002669 },
  ],
}
