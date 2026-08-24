import type { Line } from '../../domain/types.ts'

// JR中央・総武線各駅停車 山手線環内〜環沿い16駅（中野→錦糸町）。座標は WGS84。
// 御茶ノ水で中央線(西側)と総武線(東側)が直通。
// 座標は OpenStreetMap の route relation (id=3351488, 10312042, 10312043) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const chuoSobuLocalLine: Line = {
  id: 'chuo-sobu-local',
  name: 'JR中央・総武線各駅停車',
  color: '#fdb713',
  category: 'jr',
  stations: [
    { id: 'jb01', name: '中野', lineId: 'chuo-sobu-local', lon: 139.6655494, lat: 35.7055703 },
    { id: 'jb02', name: '東中野', lineId: 'chuo-sobu-local', lon: 139.6848721, lat: 35.7062048 },
    { id: 'jb03', name: '大久保', lineId: 'chuo-sobu-local', lon: 139.6973764, lat: 35.7007944 },
    { id: 'jb04', name: '新宿', lineId: 'chuo-sobu-local', lon: 139.7001716, lat: 35.6889387 },
    { id: 'jb05', name: '代々木', lineId: 'chuo-sobu-local', lon: 139.702128, lat: 35.6839594 },
    { id: 'jb06', name: '千駄ヶ谷', lineId: 'chuo-sobu-local', lon: 139.7113735, lat: 35.6813099 },
    { id: 'jb07', name: '信濃町', lineId: 'chuo-sobu-local', lon: 139.7204223, lat: 35.6800759 },
    { id: 'jb08', name: '四ツ谷', lineId: 'chuo-sobu-local', lon: 139.7307233, lat: 35.6858732 },
    { id: 'jb09', name: '市ヶ谷', lineId: 'chuo-sobu-local', lon: 139.7354993, lat: 35.6913951 },
    { id: 'jb10', name: '飯田橋', lineId: 'chuo-sobu-local', lon: 139.7440022, lat: 35.7007418 },
    { id: 'jb11', name: '水道橋', lineId: 'chuo-sobu-local', lon: 139.7537391, lat: 35.7020574 },
    { id: 'jb12', name: '御茶ノ水', lineId: 'chuo-sobu-local', lon: 139.7650256, lat: 35.6996118 },
    { id: 'jb13', name: '秋葉原', lineId: 'chuo-sobu-local', lon: 139.7730455, lat: 35.6983486 },
    { id: 'jb14', name: '浅草橋', lineId: 'chuo-sobu-local', lon: 139.784685, lat: 35.6974192 },
    { id: 'jb15', name: '両国', lineId: 'chuo-sobu-local', lon: 139.7929702, lat: 35.6957613 },
    { id: 'jb16', name: '錦糸町', lineId: 'chuo-sobu-local', lon: 139.8141603, lat: 35.6967142 },
  ],
}
