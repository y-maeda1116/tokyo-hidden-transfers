import type { Line } from '../../domain/types.ts'

// 西武園線 2駅（東村山→西武園）。座標は WGS84。
// 西武園線。西武園→東村山、全駅東村山市。
// 駅id は seibu-seibuen-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=11722741) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const seibuSeibuenLine: Line = {
  id: 'seibu-seibuen',
  name: '西武園線',
  color: '#bfae4e',
  category: 'private',
  stations: [
    { id: 'seibu-seibuen-01', name: '東村山', lineId: 'seibu-seibuen', lon: 139.4657531, lat: 35.7602668 },
    { id: 'seibu-seibuen-02', name: '西武園', lineId: 'seibu-seibuen', lon: 139.4487688, lat: 35.7678262 },
  ],
}
