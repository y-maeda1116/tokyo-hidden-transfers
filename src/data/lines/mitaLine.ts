import type { Line } from '../../domain/types.ts'

// 都営三田線 全27駅（I01目黒→I27西高島平）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=443286) の role=stop ノード（停車位置）から取得。
// 目黒(I01)・西高島平(I27) は relation の stop 欠落のため railway=station ノードで補完。
// © OpenStreetMap contributors。
// 注: 三田線に田町・大門・新橋・二重橋前は乗り入れていない（過去の誤認を訂正）。
export const mitaLine: Line = {
  id: 'mita',
  name: '都営三田線',
  color: '#0078ba',
  category: 'toei',
  stations: [
    { id: 'i01', name: '目黒', lineId: 'mita', lon: 139.7157717, lat: 35.6325078 },
    { id: 'i02', name: '白金台', lineId: 'mita', lon: 139.7265558, lat: 35.6381169 },
    { id: 'i03', name: '白金高輪', lineId: 'mita', lon: 139.7340053, lat: 35.6429669 },
    { id: 'i04', name: '三田', lineId: 'mita', lon: 139.7485807, lat: 35.6480843 },
    { id: 'i05', name: '芝公園', lineId: 'mita', lon: 139.7498714, lat: 35.6542309 },
    { id: 'i06', name: '御成門', lineId: 'mita', lon: 139.7512869, lat: 35.6608276 },
    { id: 'i07', name: '内幸町', lineId: 'mita', lon: 139.7553001, lat: 35.6694851 },
    { id: 'i08', name: '日比谷', lineId: 'mita', lon: 139.7601265, lat: 35.6762873 },
    { id: 'i09', name: '大手町', lineId: 'mita', lon: 139.7626682, lat: 35.6839724 },
    { id: 'i10', name: '神保町', lineId: 'mita', lon: 139.7582452, lat: 35.6949878 },
    { id: 'i11', name: '水道橋', lineId: 'mita', lon: 139.7551113, lat: 35.7035224 },
    { id: 'i12', name: '春日', lineId: 'mita', lon: 139.7531498, lat: 35.7099084 },
    { id: 'i13', name: '白山', lineId: 'mita', lon: 139.7521258, lat: 35.7215191 },
    { id: 'i14', name: '千石', lineId: 'mita', lon: 139.7449457, lat: 35.7276828 },
    { id: 'i15', name: '巣鴨', lineId: 'mita', lon: 139.7381841, lat: 35.7337434 },
    { id: 'i16', name: '西巣鴨', lineId: 'mita', lon: 139.7286561, lat: 35.743529 },
    { id: 'i17', name: '新板橋', lineId: 'mita', lon: 139.7199957, lat: 35.748744 },
    { id: 'i18', name: '板橋区役所前', lineId: 'mita', lon: 139.7100156, lat: 35.7513354 },
    { id: 'i19', name: '板橋本町', lineId: 'mita', lon: 139.7054985, lat: 35.7614278 },
    { id: 'i20', name: '本蓮沼', lineId: 'mita', lon: 139.7024273, lat: 35.7685127 },
    { id: 'i21', name: '志村坂上', lineId: 'mita', lon: 139.6954813, lat: 35.7756747 },
    { id: 'i22', name: '志村三丁目', lineId: 'mita', lon: 139.6859899, lat: 35.7774881 },
    { id: 'i23', name: '蓮根', lineId: 'mita', lon: 139.678984, lat: 35.7841688 },
    { id: 'i24', name: '西台', lineId: 'mita', lon: 139.6740086, lat: 35.786948 },
    { id: 'i25', name: '高島平', lineId: 'mita', lon: 139.6612689, lat: 35.7888074 },
    { id: 'i26', name: '新高島平', lineId: 'mita', lon: 139.6543429, lat: 35.7902113 },
    { id: 'i27', name: '西高島平', lineId: 'mita', lon: 139.6457724, lat: 35.7919112 },
  ],
}
