import type { Line } from '../../domain/types.ts'

// 東京メトロ千代田線 全19駅（C01代々木上原→C19綾瀬）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=443284/8026050) の role=stop
// ノードから取得。© OpenStreetMap contributors。
// 補足: 代々木上原が各 relation で欠落していたため railway=station ノードから補完。
// 注: 本線のみ（北綾瀬支線 C19綾瀬〜北綾瀬 は別途）。
export const chiyodaLine: Line = {
  id: 'chiyoda',
  name: '東京メトロ千代田線',
  color: '#00bb85',
  stations: [
    { id: 'c01', name: '代々木上原', lineId: 'chiyoda', lon: 139.6797884, lat: 35.6690082 },
    { id: 'c02', name: '代々木公園', lineId: 'chiyoda', lon: 139.6901201, lat: 35.6690693 },
    { id: 'c03', name: '明治神宮前〈原宿〉', lineId: 'chiyoda', lon: 139.7043842, lat: 35.6690037 },
    { id: 'c04', name: '表参道', lineId: 'chiyoda', lon: 139.7124388, lat: 35.6652821 },
    { id: 'c05', name: '乃木坂', lineId: 'chiyoda', lon: 139.726291, lat: 35.6667086 },
    { id: 'c06', name: '赤坂', lineId: 'chiyoda', lon: 139.7362799, lat: 35.672188 },
    { id: 'c07', name: '国会議事堂前', lineId: 'chiyoda', lon: 139.743424, lat: 35.6737567 },
    { id: 'c08', name: '霞ケ関', lineId: 'chiyoda', lon: 139.751661, lat: 35.6725562 },
    { id: 'c09', name: '日比谷', lineId: 'chiyoda', lon: 139.7583081, lat: 35.6737764 },
    { id: 'c10', name: '二重橋前〈丸の内〉', lineId: 'chiyoda', lon: 139.7616204, lat: 35.6803364 },
    { id: 'c11', name: '大手町', lineId: 'chiyoda', lon: 139.763575, lat: 35.6867813 },
    { id: 'c12', name: '新御茶ノ水', lineId: 'chiyoda', lon: 139.765493, lat: 35.6972103 },
    { id: 'c13', name: '湯島', lineId: 'chiyoda', lon: 139.7699318, lat: 35.7073337 },
    { id: 'c14', name: '根津', lineId: 'chiyoda', lon: 139.765722, lat: 35.7173532 },
    { id: 'c15', name: '千駄木', lineId: 'chiyoda', lon: 139.7632712, lat: 35.7255471 },
    { id: 'c16', name: '西日暮里', lineId: 'chiyoda', lon: 139.7672213, lat: 35.7325785 },
    { id: 'c17', name: '町屋', lineId: 'chiyoda', lon: 139.780081, lat: 35.7421821 },
    { id: 'c18', name: '北千住', lineId: 'chiyoda', lon: 139.8044308, lat: 35.7496771 },
    { id: 'c19', name: '綾瀬', lineId: 'chiyoda', lon: 139.8248629, lat: 35.7621739 },
  ],
}
