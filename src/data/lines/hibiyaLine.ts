import type { Line } from '../../domain/types.ts'

// 東京メトロ日比谷線 全22駅（H01中目黒→H22北千住）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=443272, 中目黒→北千住) の
// role=stop ノード（停車位置）から取得。© OpenStreetMap contributors。
// 注: H06虎ノ門ヒルズ（2023年開業）を含む22駅。
export const hibiyaLine: Line = {
  id: 'hibiya',
  name: '東京メトロ日比谷線',
  color: '#b5b5ac',
  stations: [
    { id: 'h01', name: '中目黒', lineId: 'hibiya', lon: 139.6987513, lat: 35.6440969 },
    { id: 'h02', name: '恵比寿', lineId: 'hibiya', lon: 139.7086263, lat: 35.6469875 },
    { id: 'h03', name: '広尾', lineId: 'hibiya', lon: 139.7221799, lat: 35.6520769 },
    { id: 'h04', name: '六本木', lineId: 'hibiya', lon: 139.7313156, lat: 35.662855 },
    { id: 'h05', name: '神谷町', lineId: 'hibiya', lon: 139.7450394, lat: 35.6630056 },
    { id: 'h06', name: '虎ノ門ヒルズ', lineId: 'hibiya', lon: 139.7478206, lat: 35.6674931 },
    { id: 'h07', name: '霞ケ関', lineId: 'hibiya', lon: 139.7510003, lat: 35.6738941 },
    { id: 'h08', name: '日比谷', lineId: 'hibiya', lon: 139.7603624, lat: 35.6744266 },
    { id: 'h09', name: '銀座', lineId: 'hibiya', lon: 139.7639439, lat: 35.6721112 },
    { id: 'h10', name: '東銀座', lineId: 'hibiya', lon: 139.7669892, lat: 35.6697512 },
    { id: 'h11', name: '築地', lineId: 'hibiya', lon: 139.7725834, lat: 35.668101 },
    { id: 'h12', name: '八丁堀', lineId: 'hibiya', lon: 139.777029, lat: 35.6750179 },
    { id: 'h13', name: '茅場町', lineId: 'hibiya', lon: 139.7797162, lat: 35.6792641 },
    { id: 'h14', name: '人形町', lineId: 'hibiya', lon: 139.7824117, lat: 35.6861586 },
    { id: 'h15', name: '小伝馬町', lineId: 'hibiya', lon: 139.7784319, lat: 35.69074 },
    { id: 'h16', name: '秋葉原', lineId: 'hibiya', lon: 139.7754836, lat: 35.6985177 },
    { id: 'h17', name: '仲御徒町', lineId: 'hibiya', lon: 139.7761378, lat: 35.7065762 },
    { id: 'h18', name: '上野', lineId: 'hibiya', lon: 139.7775675, lat: 35.7118534 },
    { id: 'h19', name: '入谷', lineId: 'hibiya', lon: 139.7845703, lat: 35.7207339 },
    { id: 'h20', name: '三ノ輪', lineId: 'hibiya', lon: 139.7912727, lat: 35.729566 },
    { id: 'h21', name: '南千住', lineId: 'hibiya', lon: 139.7987663, lat: 35.7323388 },
    { id: 'h22', name: '北千住', lineId: 'hibiya', lon: 139.8052821, lat: 35.7495425 },
  ],
}
