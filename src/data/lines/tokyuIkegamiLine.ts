import type { Line } from '../../domain/types.ts'

// 東急池上線 15駅（五反田→蒲田）。座標は WGS84。
// 東急池上線。五反田→蒲田、全駅都内（品川区・大田区）。
// 駅id は tokyu-ikegami-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=9342008) のメンバー順序どおりの停車位置から取得。
// ※ relation のメンバー順では戸越銀座が末尾だったが、実際の駅順（大崎広小路の次）に入れ替え。
// © OpenStreetMap contributors。
export const tokyuIkegamiLine: Line = {
  id: 'tokyu-ikegami',
  name: '東急池上線',
  color: '#2f5f9e',
  category: 'private',
  stations: [
    { id: 'tokyu-ikegami-01', name: '五反田', lineId: 'tokyu-ikegami', lon: 139.724105, lat: 35.6249651 },
    { id: 'tokyu-ikegami-02', name: '大崎広小路', lineId: 'tokyu-ikegami', lon: 139.7226222, lat: 35.6225314 },
    { id: 'tokyu-ikegami-03', name: '戸越銀座', lineId: 'tokyu-ikegami', lon: 139.7150881, lat: 35.616195 },
    { id: 'tokyu-ikegami-04', name: '荏原中延', lineId: 'tokyu-ikegami', lon: 139.711939, lat: 35.6098849 },
    { id: 'tokyu-ikegami-05', name: '旗の台', lineId: 'tokyu-ikegami', lon: 139.7033935, lat: 35.6051757 },
    { id: 'tokyu-ikegami-06', name: '長原', lineId: 'tokyu-ikegami', lon: 139.6979567, lat: 35.6022425 },
    { id: 'tokyu-ikegami-07', name: '洗足池', lineId: 'tokyu-ikegami', lon: 139.6913119, lat: 35.5997821 },
    { id: 'tokyu-ikegami-08', name: '石川台', lineId: 'tokyu-ikegami', lon: 139.6852351, lat: 35.5969482 },
    { id: 'tokyu-ikegami-09', name: '雪が谷大塚', lineId: 'tokyu-ikegami', lon: 139.6810804, lat: 35.5919742 },
    { id: 'tokyu-ikegami-10', name: '御嶽山', lineId: 'tokyu-ikegami', lon: 139.6824932, lat: 35.5852605 },
    { id: 'tokyu-ikegami-11', name: '久が原', lineId: 'tokyu-ikegami', lon: 139.6856737, lat: 35.5796029 },
    { id: 'tokyu-ikegami-12', name: '千鳥町', lineId: 'tokyu-ikegami', lon: 139.6915953, lat: 35.5729264 },
    { id: 'tokyu-ikegami-13', name: '池上', lineId: 'tokyu-ikegami', lon: 139.7030503, lat: 35.5720352 },
    { id: 'tokyu-ikegami-14', name: '蓮沼', lineId: 'tokyu-ikegami', lon: 139.7085395, lat: 35.5642544 },
    { id: 'tokyu-ikegami-15', name: '蒲田', lineId: 'tokyu-ikegami', lon: 139.7146628, lat: 35.5618856 },
  ],
}
