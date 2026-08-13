import type { Line } from '../../domain/types.ts'

// JR東日本 山手線 全30駅（JY01大崎→JY30品川、外回り順・環状運転）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=1972920) の role=stop ノード（停車位置）から取得。
// © OpenStreetMap contributors。
export const yamanoteLine: Line = {
  id: 'yamanote',
  name: 'JR山手線',
  color: '#9acd32',
  category: 'jr',
  closed: true, // 環状運転: 品川(JY30)→大崎(JY01) へ戻り線を描画して環を閉じる
  stations: [
    { id: 'jy01', name: '大崎', lineId: 'yamanote', lon: 139.728663, lat: 35.6194747 },
    { id: 'jy02', name: '五反田', lineId: 'yamanote', lon: 139.7235645, lat: 35.6262242 },
    { id: 'jy03', name: '目黒', lineId: 'yamanote', lon: 139.7156689, lat: 35.6340624 },
    { id: 'jy04', name: '恵比寿', lineId: 'yamanote', lon: 139.7101042, lat: 35.6464034 },
    { id: 'jy05', name: '渋谷', lineId: 'yamanote', lon: 139.7015858, lat: 35.6580215 },
    { id: 'jy06', name: '原宿', lineId: 'yamanote', lon: 139.7023701, lat: 35.6702225 },
    { id: 'jy07', name: '代々木', lineId: 'yamanote', lon: 139.7019863, lat: 35.6839356 },
    { id: 'jy08', name: '新宿', lineId: 'yamanote', lon: 139.7002855, lat: 35.6889594 },
    { id: 'jy09', name: '新大久保', lineId: 'yamanote', lon: 139.7001876, lat: 35.7013028 },
    { id: 'jy10', name: '高田馬場', lineId: 'yamanote', lon: 139.7035866, lat: 35.7126962 },
    { id: 'jy11', name: '目白', lineId: 'yamanote', lon: 139.7064126, lat: 35.7212053 },
    { id: 'jy12', name: '池袋', lineId: 'yamanote', lon: 139.710949, lat: 35.730257 },
    { id: 'jy13', name: '大塚', lineId: 'yamanote', lon: 139.7286102, lat: 35.7317315 },
    { id: 'jy14', name: '巣鴨', lineId: 'yamanote', lon: 139.7394013, lat: 35.7334579 },
    { id: 'jy15', name: '駒込', lineId: 'yamanote', lon: 139.747219, lat: 35.7366191 },
    { id: 'jy16', name: '田端', lineId: 'yamanote', lon: 139.7617238, lat: 35.7373845 },
    { id: 'jy17', name: '西日暮里', lineId: 'yamanote', lon: 139.766696, lat: 35.7322151 },
    { id: 'jy18', name: '日暮里', lineId: 'yamanote', lon: 139.7704317, lat: 35.7279885 },
    { id: 'jy19', name: '鶯谷', lineId: 'yamanote', lon: 139.7779296, lat: 35.7217118 },
    { id: 'jy20', name: '上野', lineId: 'yamanote', lon: 139.7761427, lat: 35.7135763 },
    { id: 'jy21', name: '御徒町', lineId: 'yamanote', lon: 139.7746504, lat: 35.7069502 },
    { id: 'jy22', name: '秋葉原', lineId: 'yamanote', lon: 139.77306, lat: 35.6983717 },
    { id: 'jy23', name: '神田', lineId: 'yamanote', lon: 139.7710125, lat: 35.6917689 },
    { id: 'jy24', name: '東京', lineId: 'yamanote', lon: 139.7666095, lat: 35.681244 },
    { id: 'jy25', name: '有楽町', lineId: 'yamanote', lon: 139.7630649, lat: 35.6749465 },
    { id: 'jy26', name: '新橋', lineId: 'yamanote', lon: 139.7581445, lat: 35.6661619 },
    { id: 'jy27', name: '浜松町', lineId: 'yamanote', lon: 139.7570793, lat: 35.6551093 },
    { id: 'jy28', name: '田町', lineId: 'yamanote', lon: 139.7476989, lat: 35.6457196 },
    { id: 'jy29', name: '高輪ゲートウェイ', lineId: 'yamanote', lon: 139.7406431, lat: 35.6354057 },
    { id: 'jy30', name: '品川', lineId: 'yamanote', lon: 139.7385065, lat: 35.6286608 },
  ],
}
