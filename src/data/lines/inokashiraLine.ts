import type { Line } from '../../domain/types.ts'

// 井の頭線 17駅（渋谷→吉祥寺）。座標は WGS84。
// 京王井の頭線。渋谷→吉祥寺、全駅都内（世田谷区・杉並区・武蔵野市・三鷹市）。
// 駅id は inokashira-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=11602038) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const inokashiraLine: Line = {
  id: 'inokashira',
  name: '井の頭線',
  color: '#2e6fb7',
  category: 'private',
  stations: [
    { id: 'inokashira-01', name: '渋谷', lineId: 'inokashira', lon: 139.699007, lat: 35.6584056 },
    { id: 'inokashira-02', name: '神泉', lineId: 'inokashira', lon: 139.693332, lat: 35.6571884 },
    { id: 'inokashira-03', name: '駒場東大前', lineId: 'inokashira', lon: 139.6840735, lat: 35.6587073 },
    { id: 'inokashira-04', name: '池ノ上', lineId: 'inokashira', lon: 139.673304, lat: 35.6604137 },
    { id: 'inokashira-05', name: '下北沢', lineId: 'inokashira', lon: 139.6670568, lat: 35.6615157 },
    { id: 'inokashira-06', name: '新代田', lineId: 'inokashira', lon: 139.6606128, lat: 35.6625826 },
    { id: 'inokashira-07', name: '東松原', lineId: 'inokashira', lon: 139.6558508, lat: 35.6625951 },
    { id: 'inokashira-08', name: '明大前', lineId: 'inokashira', lon: 139.6503634, lat: 35.6690878 },
    { id: 'inokashira-09', name: '永福町', lineId: 'inokashira', lon: 139.6426181, lat: 35.6762478 },
    { id: 'inokashira-10', name: '西永福', lineId: 'inokashira', lon: 139.6353132, lat: 35.6787762 },
    { id: 'inokashira-11', name: '浜田山', lineId: 'inokashira', lon: 139.6274386, lat: 35.6816115 },
    { id: 'inokashira-12', name: '高井戸', lineId: 'inokashira', lon: 139.6149575, lat: 35.6831862 },
    { id: 'inokashira-13', name: '富士見ヶ丘', lineId: 'inokashira', lon: 139.6073685, lat: 35.6846944 },
    { id: 'inokashira-14', name: '久我山', lineId: 'inokashira', lon: 139.5995653, lat: 35.6879309 },
    { id: 'inokashira-15', name: '三鷹台', lineId: 'inokashira', lon: 139.5890973, lat: 35.692157 },
    { id: 'inokashira-16', name: '井の頭公園', lineId: 'inokashira', lon: 139.5831099, lat: 35.6972555 },
    { id: 'inokashira-17', name: '吉祥寺', lineId: 'inokashira', lon: 139.5803599, lat: 35.7022137 },
  ],
}
