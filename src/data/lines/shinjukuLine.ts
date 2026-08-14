import type { Line } from '../../domain/types.ts'

// 都営新宿線 全21駅（S01新宿→S21本八幡）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=8019858, 443259) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const shinjukuLine: Line = {
  id: 'shinjuku',
  name: '都営新宿線',
  color: '#b5b5ac',
  category: 'toei',
  stations: [
    { id: 's01', name: '新宿', lineId: 'shinjuku', lon: 139.7006009, lat: 35.6922273 },
    { id: 's02', name: '新宿三丁目', lineId: 'shinjuku', lon: 139.7062103, lat: 35.6908282 },
    { id: 's03', name: '曙橋', lineId: 'shinjuku', lon: 139.722861, lat: 35.6924315 },
    { id: 's04', name: '市ヶ谷', lineId: 'shinjuku', lon: 139.737639, lat: 35.691556 },
    { id: 's05', name: '九段下', lineId: 'shinjuku', lon: 139.7503608, lat: 35.695379 },
    { id: 's06', name: '神保町', lineId: 'shinjuku', lon: 139.7583926, lat: 35.6959853 },
    { id: 's07', name: '小川町', lineId: 'shinjuku', lon: 139.7662652, lat: 35.6950026 },
    { id: 's08', name: '岩本町', lineId: 'shinjuku', lon: 139.7753861, lat: 35.6956713 },
    { id: 's09', name: '馬喰横山', lineId: 'shinjuku', lon: 139.7828129, lat: 35.6921382 },
    { id: 's10', name: '浜町', lineId: 'shinjuku', lon: 139.7881481, lat: 35.688536 },
    { id: 's11', name: '森下', lineId: 'shinjuku', lon: 139.7970454, lat: 35.6879426 },
    { id: 's12', name: '菊川', lineId: 'shinjuku', lon: 139.8061256, lat: 35.6883604 },
    { id: 's13', name: '住吉', lineId: 'shinjuku', lon: 139.8160454, lat: 35.6890094 },
    { id: 's14', name: '西大島', lineId: 'shinjuku', lon: 139.8266363, lat: 35.6893108 },
    { id: 's15', name: '大島', lineId: 'shinjuku', lon: 139.8350966, lat: 35.6896928 },
    { id: 's16', name: '東大島', lineId: 'shinjuku', lon: 139.8459504, lat: 35.6902749 },
    { id: 's17', name: '船堀', lineId: 'shinjuku', lon: 139.8642986, lat: 35.6838107 },
    { id: 's18', name: '一之江', lineId: 'shinjuku', lon: 139.8831224, lat: 35.6859919 },
    { id: 's19', name: '瑞江', lineId: 'shinjuku', lon: 139.897711, lat: 35.6932271 },
    { id: 's20', name: '篠崎', lineId: 'shinjuku', lon: 139.9038794, lat: 35.7060456 },
    { id: 's21', name: '本八幡', lineId: 'shinjuku', lon: 139.9271332, lat: 35.7237395 },
  ],
}
