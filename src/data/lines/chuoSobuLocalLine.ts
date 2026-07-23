import type { Line } from '../../domain/types.ts'

// JR中央・総武線各駅停車 山手線環内〜環沿い16駅（中野→錦糸町）。座標は WGS84。
// 御茶ノ水で中央線(西側)と総武線(東側)が直通。座標は主要駅ベースの推定値
// （新宿・代々木・秋葉原・両国などは既存路線と同一座標）。Pages で要目視確認。
export const chuoSobuLocalLine: Line = {
  id: 'chuo-sobu-local',
  name: 'JR中央・総武線各駅停車',
  color: '#fdb713',
  stations: [
    { id: 'jb01', name: '中野', lineId: 'chuo-sobu-local', lon: 139.6660, lat: 35.7080 },
    { id: 'jb02', name: '東中野', lineId: 'chuo-sobu-local', lon: 139.6830, lat: 35.7070 },
    { id: 'jb03', name: '大久保', lineId: 'chuo-sobu-local', lon: 139.7000, lat: 35.7020 },
    { id: 'jb04', name: '新宿', lineId: 'chuo-sobu-local', lon: 139.7005, lat: 35.6909 },
    { id: 'jb05', name: '代々木', lineId: 'chuo-sobu-local', lon: 139.7012, lat: 35.6828 },
    { id: 'jb06', name: '千駄ヶ谷', lineId: 'chuo-sobu-local', lon: 139.7100, lat: 35.6775 },
    { id: 'jb07', name: '信濃町', lineId: 'chuo-sobu-local', lon: 139.7250, lat: 35.6725 },
    { id: 'jb08', name: '四ツ谷', lineId: 'chuo-sobu-local', lon: 139.7300, lat: 35.6855 },
    { id: 'jb09', name: '市ヶ谷', lineId: 'chuo-sobu-local', lon: 139.7370, lat: 35.6900 },
    { id: 'jb10', name: '飯田橋', lineId: 'chuo-sobu-local', lon: 139.7440, lat: 35.7020 },
    { id: 'jb11', name: '水道橋', lineId: 'chuo-sobu-local', lon: 139.7530, lat: 35.6990 },
    { id: 'jb12', name: '御茶ノ水', lineId: 'chuo-sobu-local', lon: 139.7640, lat: 35.6990 },
    { id: 'jb13', name: '秋葉原', lineId: 'chuo-sobu-local', lon: 139.7732, lat: 35.6986 },
    { id: 'jb14', name: '浅草橋', lineId: 'chuo-sobu-local', lon: 139.7876, lat: 35.7019 },
    { id: 'jb15', name: '両国', lineId: 'chuo-sobu-local', lon: 139.7925, lat: 35.6961 },
    { id: 'jb16', name: '錦糸町', lineId: 'chuo-sobu-local', lon: 139.8140, lat: 35.6960 },
  ],
}
