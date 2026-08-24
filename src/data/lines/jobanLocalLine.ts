import type { Line } from '../../domain/types.ts'

// 常磐線（各駅停車） 3駅（綾瀬→金町）。座標は WGS84。
// JR常磐線各駅停車（千代田線直通）。都内は綾瀬・亀有・金町。松戸以遠は千葉。北千住〜綾瀬間は千代田線区間。
// 駅id は joban-local-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=10025276) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const jobanLocalLine: Line = {
  id: 'joban-local',
  name: '常磐線（各駅停車）',
  color: '#3fae6a',
  category: 'jr',
  stations: [
    { id: 'joban-local-01', name: '綾瀬', lineId: 'joban-local', lon: 139.8257595, lat: 35.7622772 },
    { id: 'joban-local-02', name: '亀有', lineId: 'joban-local', lon: 139.847992, lat: 35.7668193 },
    { id: 'joban-local-03', name: '金町', lineId: 'joban-local', lon: 139.8706816, lat: 35.7696451 },
  ],
}
