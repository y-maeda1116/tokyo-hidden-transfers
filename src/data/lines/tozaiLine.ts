import type { Line } from '../../domain/types.ts'

// 東京メトロ東西線 全23駅（T01中野→T23西船橋）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=5371620, 各駅停車, 中野→西船橋) の
// role=stop ノード（停車位置）から取得。© OpenStreetMap contributors。
export const tozaiLine: Line = {
  id: 'tozai',
  name: '東京メトロ東西線',
  color: '#009bbf',
  stations: [
    { id: 't01', name: '中野', lineId: 'tozai', lon: 139.6655367, lat: 35.7058135 },
    { id: 't02', name: '落合', lineId: 'tozai', lon: 139.6859125, lat: 35.7106884 },
    { id: 't03', name: '高田馬場', lineId: 'tozai', lon: 139.7050201, lat: 35.713397 },
    { id: 't04', name: '早稲田', lineId: 'tozai', lon: 139.7212889, lat: 35.7058094 },
    { id: 't05', name: '神楽坂', lineId: 'tozai', lon: 139.7342242, lat: 35.7038933 },
    { id: 't06', name: '飯田橋', lineId: 'tozai', lon: 139.7460088, lat: 35.7017242 },
    { id: 't07', name: '九段下', lineId: 'tozai', lon: 139.7512874, lat: 35.695961 },
    { id: 't08', name: '竹橋', lineId: 'tozai', lon: 139.7587292, lat: 35.6901289 },
    { id: 't09', name: '大手町', lineId: 'tozai', lon: 139.7663685, lat: 35.6846726 },
    { id: 't10', name: '日本橋', lineId: 'tozai', lon: 139.7745258, lat: 35.6822751 },
    { id: 't11', name: '茅場町', lineId: 'tozai', lon: 139.7794292, lat: 35.6802993 },
    { id: 't12', name: '門前仲町', lineId: 'tozai', lon: 139.7950785, lat: 35.6723099 },
    { id: 't13', name: '木場', lineId: 'tozai', lon: 139.8065417, lat: 35.6694504 },
    { id: 't14', name: '東陽町', lineId: 'tozai', lon: 139.8174754, lat: 35.6696232 },
    { id: 't15', name: '南砂町', lineId: 'tozai', lon: 139.8318701, lat: 35.6683869 },
    { id: 't16', name: '西葛西', lineId: 'tozai', lon: 139.8593188, lat: 35.6645962 },
    { id: 't17', name: '葛西', lineId: 'tozai', lon: 139.8726943, lat: 35.6636754 },
    { id: 't18', name: '浦安', lineId: 'tozai', lon: 139.8929792, lat: 35.6658473 },
    { id: 't19', name: '南行徳', lineId: 'tozai', lon: 139.9022636, lat: 35.6727431 },
    { id: 't20', name: '行徳', lineId: 'tozai', lon: 139.9144703, lat: 35.6828752 },
    { id: 't21', name: '妙典', lineId: 'tozai', lon: 139.924316, lat: 35.6911668 },
    { id: 't22', name: '原木中山', lineId: 'tozai', lon: 139.941609, lat: 35.7031564 },
    { id: 't23', name: '西船橋', lineId: 'tozai', lon: 139.9588877, lat: 35.707313 },
  ],
}
