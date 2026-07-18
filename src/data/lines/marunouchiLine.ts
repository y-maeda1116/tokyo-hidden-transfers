import type { Line } from '../../domain/types.ts'

// 東京メトロ丸ノ内線 全25駅（M01荻窪→M25池袋）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=443282) の role=stop ノードから取得。
// ※ 池袋が relation で欠落していたため railway=station ノード（東京地下鉄）から補完。
//   © OpenStreetMap contributors。
// 注: 本線のみ（方南町支線 中野坂上〜方南町 は別途）。
export const marunouchiLine: Line = {
  id: 'marunouchi',
  name: '東京メトロ丸ノ内線',
  color: '#f62e36',
  stations: [
    { id: 'm01', name: '荻窪', lineId: 'marunouchi', lon: 139.6199943, lat: 35.7043191 },
    { id: 'm02', name: '南阿佐ケ谷', lineId: 'marunouchi', lon: 139.6357198, lat: 35.6994156 },
    { id: 'm03', name: '新高円寺', lineId: 'marunouchi', lon: 139.6486895, lat: 35.6978863 },
    { id: 'm04', name: '東高円寺', lineId: 'marunouchi', lon: 139.6581626, lat: 35.6979918 },
    { id: 'm05', name: '新中野', lineId: 'marunouchi', lon: 139.6686417, lat: 35.697478 },
    { id: 'm06', name: '中野坂上', lineId: 'marunouchi', lon: 139.6819279, lat: 35.6971813 },
    { id: 'm07', name: '西新宿', lineId: 'marunouchi', lon: 139.6927919, lat: 35.6944417 },
    { id: 'm08', name: '新宿', lineId: 'marunouchi', lon: 139.7005849, lat: 35.6923037 },
    { id: 'm09', name: '新宿三丁目', lineId: 'marunouchi', lon: 139.7041282, lat: 35.6912513 },
    { id: 'm10', name: '新宿御苑前', lineId: 'marunouchi', lon: 139.7107442, lat: 35.6885916 },
    { id: 'm11', name: '四谷三丁目', lineId: 'marunouchi', lon: 139.7205725, lat: 35.6880109 },
    { id: 'm12', name: '四ツ谷', lineId: 'marunouchi', lon: 139.7299937, lat: 35.6846803 },
    { id: 'm13', name: '赤坂見附', lineId: 'marunouchi', lon: 139.7375937, lat: 35.6763443 },
    { id: 'm14', name: '国会議事堂前', lineId: 'marunouchi', lon: 139.7455408, lat: 35.674555 },
    { id: 'm15', name: '霞ケ関', lineId: 'marunouchi', lon: 139.7529086, lat: 35.6742116 },
    { id: 'm16', name: '銀座', lineId: 'marunouchi', lon: 139.7630946, lat: 35.6728947 },
    { id: 'm17', name: '東京', lineId: 'marunouchi', lon: 139.764889, lat: 35.6820503 },
    { id: 'm18', name: '大手町', lineId: 'marunouchi', lon: 139.7662001, lat: 35.6867945 },
    { id: 'm19', name: '淡路町', lineId: 'marunouchi', lon: 139.767457, lat: 35.6951289 },
    { id: 'm20', name: '御茶ノ水', lineId: 'marunouchi', lon: 139.7640727, lat: 35.7005574 },
    { id: 'm21', name: '本郷三丁目', lineId: 'marunouchi', lon: 139.7601008, lat: 35.7064853 },
    { id: 'm22', name: '後楽園', lineId: 'marunouchi', lon: 139.75121, lat: 35.7073235 },
    { id: 'm23', name: '茗荷谷', lineId: 'marunouchi', lon: 139.7369206, lat: 35.7171817 },
    { id: 'm24', name: '新大塚', lineId: 'marunouchi', lon: 139.7299109, lat: 35.7257664 },
    { id: 'm25', name: '池袋', lineId: 'marunouchi', lon: 139.7114846, lat: 35.7302282 },
  ],
}
