import type { Line } from '../../domain/types.ts'

// 横浜線 4駅（八王子→相原）。座標は WGS84。
// JR横浜線。都内4駅（八王子・八王子みなみ野・片倉・相原）。橋本以遠は神奈川。
// 駅id は yokohama-line-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=10256354) のメンバー順序どおりの停車位置から取得。
// ※ relation のメンバー順では片倉が八王子みなみ野より前だったが、実際の駅順（八王子→八王子みなみ野→片倉→相原）に入れ替え。
// © OpenStreetMap contributors。
export const yokohamaLine: Line = {
  id: 'yokohama-line',
  name: '横浜線',
  color: '#8dc63f',
  category: 'jr',
  stations: [
    { id: 'yokohama-line-01', name: '八王子', lineId: 'yokohama-line', lon: 139.33944, lat: 35.6552204 },
    { id: 'yokohama-line-02', name: '八王子みなみ野', lineId: 'yokohama-line', lon: 139.3309916, lat: 35.6312373 },
    { id: 'yokohama-line-03', name: '片倉', lineId: 'yokohama-line', lon: 139.3414493, lat: 35.6397848 },
    { id: 'yokohama-line-04', name: '相原', lineId: 'yokohama-line', lon: 139.3317042, lat: 35.606844 },
  ],
}
