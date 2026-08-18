import type { Line } from '../../domain/types.ts'

// 武蔵野線 5駅（新秋津→府中本町）。座標は WGS84。
// JR武蔵野線。都内5駅（新秋津〜府中本町）。新小平・西国分寺等も都内。東所沢側と南浦和側は埼玉。
// 駅id は musashino-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=1952540) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const musashinoLine: Line = {
  id: 'musashino',
  name: '武蔵野線',
  color: '#ffb366',
  category: 'jr',
  stations: [
    { id: 'musashino-01', name: '新秋津', lineId: 'musashino', lon: 139.4938265, lat: 35.7783502 },
    { id: 'musashino-02', name: '新小平', lineId: 'musashino', lon: 139.4707127, lat: 35.7311984 },
    { id: 'musashino-03', name: '西国分寺', lineId: 'musashino', lon: 139.4660791, lat: 35.7002417 },
    { id: 'musashino-04', name: '北府中', lineId: 'musashino', lon: 139.4718315, lat: 35.680784 },
    { id: 'musashino-05', name: '府中本町', lineId: 'musashino', lon: 139.4771681, lat: 35.6661167 },
  ],
}
