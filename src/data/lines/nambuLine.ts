import type { Line } from '../../domain/types.ts'

// 南武線 9駅（南多摩→立川）。座標は WGS84。
// JR南武線。都内9駅（南多摩〜立川）。稲田堤側は川崎市。
// 駅id は nambu-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=1834403) のメンバー順序どおりの停車位置から取得。
// 是政のみ relation の stop メンバーが欠落するため、JR是政駅の platform ノード
// （node/6816092301・node/6816092302 の中点）で補完。西武多摩川線の是政駅（約200m 東）とは別駅。
// © OpenStreetMap contributors。
export const nambuLine: Line = {
  id: 'nambu',
  name: '南武線',
  color: '#fbd23f',
  category: 'jr',
  stations: [
    { id: 'nambu-01', name: '南多摩', lineId: 'nambu', lon: 139.4899031, lat: 35.6492323 },
    { id: 'nambu-02', name: '是政', lineId: 'nambu', lon: 139.4873445, lat: 35.6572085 },
    { id: 'nambu-03', name: '府中本町', lineId: 'nambu', lon: 139.4769392, lat: 35.666074 },
    { id: 'nambu-04', name: '分倍河原', lineId: 'nambu', lon: 139.4690094, lat: 35.6684306 },
    { id: 'nambu-05', name: '西府', lineId: 'nambu', lon: 139.4573839, lat: 35.6709471 },
    { id: 'nambu-06', name: '谷保', lineId: 'nambu', lon: 139.4468675, lat: 35.6813405 },
    { id: 'nambu-07', name: '矢川', lineId: 'nambu', lon: 139.4314934, lat: 35.6850471 },
    { id: 'nambu-08', name: '西国立', lineId: 'nambu', lon: 139.4240384, lat: 35.693471 },
    { id: 'nambu-09', name: '立川', lineId: 'nambu', lon: 139.4135515, lat: 35.697665 },
  ],
}
