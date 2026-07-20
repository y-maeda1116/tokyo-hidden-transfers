import type { Line } from '../../domain/types.ts'

// 東京メトロ銀座線 全19駅（G01渋谷→G19浅草）。座標は WGS84。
// 座標は OpenStreetMap の route relation (id=8026074, 渋谷→浅草) の
// role=stop ノード（停車位置）から取得。© OpenStreetMap contributors。
export const ginzaLine: Line = {
  id: 'ginza',
  name: '東京メトロ銀座線',
  color: '#ff9500',
  stations: [
    { id: 'g01', name: '渋谷', lineId: 'ginza', lon: 139.7024251, lat: 35.6590617 },
    { id: 'g02', name: '表参道', lineId: 'ginza', lon: 139.7124195, lat: 35.6650556 },
    { id: 'g03', name: '外苑前', lineId: 'ginza', lon: 139.7178217, lat: 35.6705551 },
    { id: 'g04', name: '青山一丁目', lineId: 'ginza', lon: 139.7239341, lat: 35.6726745 },
    { id: 'g05', name: '赤坂見附', lineId: 'ginza', lon: 139.7374601, lat: 35.6763066 },
    { id: 'g06', name: '溜池山王', lineId: 'ginza', lon: 139.742043, lat: 35.6715818 },
    { id: 'g07', name: '虎ノ門', lineId: 'ginza', lon: 139.750011, lat: 35.67015 },
    { id: 'g08', name: '新橋', lineId: 'ginza', lon: 139.7588763, lat: 35.6672291 },
    { id: 'g09', name: '銀座', lineId: 'ginza', lon: 139.7652566, lat: 35.6714902 },
    { id: 'g10', name: '京橋', lineId: 'ginza', lon: 139.7700459, lat: 35.6767641 },
    { id: 'g11', name: '日本橋', lineId: 'ginza', lon: 139.7733413, lat: 35.682087 },
    { id: 'g12', name: '三越前', lineId: 'ginza', lon: 139.7735518, lat: 35.6870749 },
    { id: 'g13', name: '神田', lineId: 'ginza', lon: 139.7708227, lat: 35.6937035 },
    { id: 'g14', name: '末広町', lineId: 'ginza', lon: 139.7716554, lat: 35.7029435 },
    { id: 'g15', name: '上野広小路', lineId: 'ginza', lon: 139.7729685, lat: 35.7078315 },
    { id: 'g16', name: '上野', lineId: 'ginza', lon: 139.776143, lat: 35.7117224 },
    { id: 'g17', name: '稲荷町', lineId: 'ginza', lon: 139.7826812, lat: 35.7114032 },
    { id: 'g18', name: '田原町', lineId: 'ginza', lon: 139.7907726, lat: 35.7099006 },
    { id: 'g19', name: '浅草', lineId: 'ginza', lon: 139.7978001, lat: 35.7108521 },
  ],
}
