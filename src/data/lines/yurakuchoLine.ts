import type { Line } from '../../domain/types.ts'

// 東京メトロ有楽町線 全24駅（Y01和光市→Y24新木場）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=443269, 和光市→新木場) の
// role=stop ノード（停車位置）から取得。© OpenStreetMap contributors。
export const yurakuchoLine: Line = {
  id: 'yurakucho',
  name: '東京メトロ有楽町線',
  color: '#c1a470',
  stations: [
    { id: 'y01', name: '和光市', lineId: 'yurakucho', lon: 139.6128678, lat: 35.7883529 },
    { id: 'y02', name: '地下鉄成増', lineId: 'yurakucho', lon: 139.6313339, lat: 35.776704 },
    { id: 'y03', name: '地下鉄赤塚', lineId: 'yurakucho', lon: 139.6441677, lat: 35.769971 },
    { id: 'y04', name: '平和台', lineId: 'yurakucho', lon: 139.6542458, lat: 35.7576942 },
    { id: 'y05', name: '氷川台', lineId: 'yurakucho', lon: 139.6650785, lat: 35.7498601 },
    { id: 'y06', name: '小竹向原', lineId: 'yurakucho', lon: 139.6807045, lat: 35.7429781 },
    { id: 'y07', name: '千川', lineId: 'yurakucho', lon: 139.6894971, lat: 35.7382902 },
    { id: 'y08', name: '要町', lineId: 'yurakucho', lon: 139.698716, lat: 35.73328 },
    { id: 'y09', name: '池袋', lineId: 'yurakucho', lon: 139.7097272, lat: 35.7297098 },
    { id: 'y10', name: '東池袋', lineId: 'yurakucho', lon: 139.7195905, lat: 35.7257006 },
    { id: 'y11', name: '護国寺', lineId: 'yurakucho', lon: 139.7275108, lat: 35.7191034 },
    { id: 'y12', name: '江戸川橋', lineId: 'yurakucho', lon: 139.7336008, lat: 35.7095696 },
    { id: 'y13', name: '飯田橋', lineId: 'yurakucho', lon: 139.7436174, lat: 35.7015617 },
    { id: 'y14', name: '市ケ谷', lineId: 'yurakucho', lon: 139.7367792, lat: 35.6923634 },
    { id: 'y15', name: '麹町', lineId: 'yurakucho', lon: 139.7376724, lat: 35.6840302 },
    { id: 'y16', name: '永田町', lineId: 'yurakucho', lon: 139.7416145, lat: 35.6779889 },
    { id: 'y17', name: '桜田門', lineId: 'yurakucho', lon: 139.7516866, lat: 35.6774582 },
    { id: 'y18', name: '有楽町', lineId: 'yurakucho', lon: 139.762151, lat: 35.6760219 },
    { id: 'y19', name: '銀座一丁目', lineId: 'yurakucho', lon: 139.7670566, lat: 35.6743786 },
    { id: 'y20', name: '新富町', lineId: 'yurakucho', lon: 139.7734291, lat: 35.6706504 },
    { id: 'y21', name: '月島', lineId: 'yurakucho', lon: 139.784766, lat: 35.6645697 },
    { id: 'y22', name: '豊洲', lineId: 'yurakucho', lon: 139.79625, lat: 35.6550808 },
    { id: 'y23', name: '辰巳', lineId: 'yurakucho', lon: 139.8107438, lat: 35.6455232 },
    { id: 'y24', name: '新木場', lineId: 'yurakucho', lon: 139.8266504, lat: 35.6459744 },
  ],
}
