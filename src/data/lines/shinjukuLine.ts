import type { Line } from '../../domain/types.ts'

// 都営新宿線 全21駅（S01新宿→S21本八幡）。座標は WGS84。
// 確定10駅は Wikipedia、残り11駅は前後の確定駅からの直線補間（推定）。
// 地図表示で要微修正。
export const shinjukuLine: Line = {
  id: 'shinjuku',
  name: '都営新宿線',
  color: '#b5b5ac',
  stations: [
    { id: 's01', name: '新宿', lineId: 'shinjuku', lon: 139.6885, lat: 35.67625 },
    { id: 's02', name: '新宿三丁目', lineId: 'shinjuku', lon: 139.704194, lat: 35.681167 },
    { id: 's03', name: '曙橋', lineId: 'shinjuku', lon: 139.719889, lat: 35.686083 },
    { id: 's04', name: '市ヶ谷', lineId: 'shinjuku', lon: 139.735583, lat: 35.691 },
    { id: 's05', name: '九段下', lineId: 'shinjuku', lon: 139.751278, lat: 35.695917 },
    { id: 's06', name: '神保町', lineId: 'shinjuku', lon: 139.75825, lat: 35.695111 },
    { id: 's07', name: '小川町', lineId: 'shinjuku', lon: 139.766667, lat: 35.695056 },
    { id: 's08', name: '岩本町', lineId: 'shinjuku', lon: 139.775861, lat: 35.695556 },
    { id: 's09', name: '馬喰横山', lineId: 'shinjuku', lon: 139.78279, lat: 35.69212 },
    { id: 's10', name: '浜町', lineId: 'shinjuku', lon: 139.789909, lat: 35.690046 },
    { id: 's11', name: '森下', lineId: 'shinjuku', lon: 139.797028, lat: 35.687972 },
    { id: 's12', name: '菊川', lineId: 'shinjuku', lon: 139.806542, lat: 35.688639 },
    { id: 's13', name: '住吉', lineId: 'shinjuku', lon: 139.816056, lat: 35.689306 },
    { id: 's14', name: '西大島', lineId: 'shinjuku', lon: 139.826639, lat: 35.689444 },
    { id: 's15', name: '大島', lineId: 'shinjuku', lon: 139.837222, lat: 35.689583 },
    { id: 's16', name: '東大島', lineId: 'shinjuku', lon: 139.847806, lat: 35.689722 },
    { id: 's17', name: '船堀', lineId: 'shinjuku', lon: 139.863717, lat: 35.695944 },
    { id: 's18', name: '一之江', lineId: 'shinjuku', lon: 139.879628, lat: 35.702167 },
    { id: 's19', name: '瑞江', lineId: 'shinjuku', lon: 139.895539, lat: 35.708389 },
    { id: 's20', name: '篠崎', lineId: 'shinjuku', lon: 139.91145, lat: 35.714611 },
    { id: 's21', name: '本八幡', lineId: 'shinjuku', lon: 139.927361, lat: 35.720833 },
  ],
}
