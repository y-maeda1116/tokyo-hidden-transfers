import type { Line } from '../../domain/types.ts'

// JR東日本 山手線 全30駅（JY01大崎→JY30品川、外回り順・環状運転）。座標は WGS84。
// 座標は主要ターミナルの公開座標を基準にした推定値（誤差数十〜数百mの可能性）。
// GitHub Pages 上で要目視確認。正確化は OSM route relation 等での取得を推奨。
// 注: 既存の LineString 描画の都合で品川(JY30)→大崎(JY01) の結線は閉じない。
export const yamanoteLine: Line = {
  id: 'yamanote',
  name: 'JR山手線',
  color: '#9acd32',
  stations: [
    { id: 'jy01', name: '大崎', lineId: 'yamanote', lon: 139.7285, lat: 35.6197 },
    { id: 'jy02', name: '五反田', lineId: 'yamanote', lon: 139.7224, lat: 35.6264 },
    { id: 'jy03', name: '目黒', lineId: 'yamanote', lon: 139.7153, lat: 35.6339 },
    { id: 'jy04', name: '恵比寿', lineId: 'yamanote', lon: 139.7100, lat: 35.6467 },
    { id: 'jy05', name: '渋谷', lineId: 'yamanote', lon: 139.7016, lat: 35.6585 },
    { id: 'jy06', name: '原宿', lineId: 'yamanote', lon: 139.7026, lat: 35.6706 },
    { id: 'jy07', name: '代々木', lineId: 'yamanote', lon: 139.7012, lat: 35.6828 },
    { id: 'jy08', name: '新宿', lineId: 'yamanote', lon: 139.7005, lat: 35.6909 },
    { id: 'jy09', name: '新大久保', lineId: 'yamanote', lon: 139.7003, lat: 35.7009 },
    { id: 'jy10', name: '高田馬場', lineId: 'yamanote', lon: 139.7038, lat: 35.7124 },
    { id: 'jy11', name: '目白', lineId: 'yamanote', lon: 139.7054, lat: 35.7196 },
    { id: 'jy12', name: '池袋', lineId: 'yamanote', lon: 139.7109, lat: 35.7295 },
    { id: 'jy13', name: '大塚', lineId: 'yamanote', lon: 139.7290, lat: 35.7317 },
    { id: 'jy14', name: '巣鴨', lineId: 'yamanote', lon: 139.7393, lat: 35.7340 },
    { id: 'jy15', name: '駒込', lineId: 'yamanote', lon: 139.7471, lat: 35.7366 },
    { id: 'jy16', name: '田端', lineId: 'yamanote', lon: 139.7607, lat: 35.7381 },
    { id: 'jy17', name: '西日暮里', lineId: 'yamanote', lon: 139.7664, lat: 35.7320 },
    { id: 'jy18', name: '日暮里', lineId: 'yamanote', lon: 139.7713, lat: 35.7282 },
    { id: 'jy19', name: '鶯谷', lineId: 'yamanote', lon: 139.7781, lat: 35.7216 },
    { id: 'jy20', name: '上野', lineId: 'yamanote', lon: 139.7775, lat: 35.7138 },
    { id: 'jy21', name: '御徒町', lineId: 'yamanote', lon: 139.7745, lat: 35.7073 },
    { id: 'jy22', name: '秋葉原', lineId: 'yamanote', lon: 139.7732, lat: 35.6986 },
    { id: 'jy23', name: '神田', lineId: 'yamanote', lon: 139.7706, lat: 35.6915 },
    { id: 'jy24', name: '東京', lineId: 'yamanote', lon: 139.7671, lat: 35.6812 },
    { id: 'jy25', name: '有楽町', lineId: 'yamanote', lon: 139.7635, lat: 35.6752 },
    { id: 'jy26', name: '新橋', lineId: 'yamanote', lon: 139.7586, lat: 35.6654 },
    { id: 'jy27', name: '浜松町', lineId: 'yamanote', lon: 139.7566, lat: 35.6556 },
    { id: 'jy28', name: '田町', lineId: 'yamanote', lon: 139.7477, lat: 35.6452 },
    { id: 'jy29', name: '高輪ゲートウェイ', lineId: 'yamanote', lon: 139.7411, lat: 35.6370 },
    { id: 'jy30', name: '品川', lineId: 'yamanote', lon: 139.7396, lat: 35.6287 },
  ],
}
