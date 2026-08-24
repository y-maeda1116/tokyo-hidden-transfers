import type { Line } from '../../domain/types.ts'

// 西武池袋線 16駅（秋津→池袋）。座標は WGS84。
// 西武池袋線。秋津（清瀬市）→池袋区間。ひばりヶ丘は埼玉だが路線の連続性のため含む。所沢以遠は埼玉。
// 駅id は seibu-ikebukuro-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=11763511) のメンバーから取得。
// ※ relation のメンバー順は池袋の後に富士見台〜石神井公園が続く壊れた順序のため、
// 実駅順（秋津→…→石神井公園→…→池袋、経度単調増加で検証）に並べ替え。
// © OpenStreetMap contributors。
export const seibuIkebukuroLine: Line = {
  id: 'seibu-ikebukuro',
  name: '西武池袋線',
  color: '#ff7e00',
  category: 'private',
  stations: [
    { id: 'seibu-ikebukuro-01', name: '秋津', lineId: 'seibu-ikebukuro', lon: 139.4978191, lat: 35.7782044 },
    { id: 'seibu-ikebukuro-02', name: '清瀬', lineId: 'seibu-ikebukuro', lon: 139.5200519, lat: 35.7721532 },
    { id: 'seibu-ikebukuro-03', name: '東久留米', lineId: 'seibu-ikebukuro', lon: 139.5340857, lat: 35.7602906 },
    { id: 'seibu-ikebukuro-04', name: 'ひばりヶ丘', lineId: 'seibu-ikebukuro', lon: 139.5456651, lat: 35.7515583 },
    { id: 'seibu-ikebukuro-05', name: '保谷', lineId: 'seibu-ikebukuro', lon: 139.5677939, lat: 35.7483659 },
    { id: 'seibu-ikebukuro-06', name: '大泉学園', lineId: 'seibu-ikebukuro', lon: 139.5866345, lat: 35.7495568 },
    { id: 'seibu-ikebukuro-07', name: '石神井公園', lineId: 'seibu-ikebukuro', lon: 139.6061656, lat: 35.7438455 },
    { id: 'seibu-ikebukuro-08', name: '練馬高野台', lineId: 'seibu-ikebukuro', lon: 139.616332, lat: 35.7409764 },
    { id: 'seibu-ikebukuro-09', name: '富士見台', lineId: 'seibu-ikebukuro', lon: 139.6297262, lat: 35.7359771 },
    { id: 'seibu-ikebukuro-10', name: '中村橋', lineId: 'seibu-ikebukuro', lon: 139.6377903, lat: 35.7368591 },
    { id: 'seibu-ikebukuro-11', name: '練馬', lineId: 'seibu-ikebukuro', lon: 139.6541135, lat: 35.7378707 },
    { id: 'seibu-ikebukuro-12', name: '桜台', lineId: 'seibu-ikebukuro', lon: 139.662426, lat: 35.7388121 },
    { id: 'seibu-ikebukuro-13', name: '江古田', lineId: 'seibu-ikebukuro', lon: 139.6727496, lat: 35.7376016 },
    { id: 'seibu-ikebukuro-14', name: '東長崎', lineId: 'seibu-ikebukuro', lon: 139.6829059, lat: 35.7303248 },
    { id: 'seibu-ikebukuro-15', name: '椎名町', lineId: 'seibu-ikebukuro', lon: 139.6948993, lat: 35.7264761 },
    { id: 'seibu-ikebukuro-16', name: '池袋', lineId: 'seibu-ikebukuro', lon: 139.7108606, lat: 35.7281021 },
  ],
}
