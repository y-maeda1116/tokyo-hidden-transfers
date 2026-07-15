import type { Line } from '../../domain/types.ts'

// 東京メトロ銀座線（浅草の乗換を表現するための最小駅セット）
export const ginzaLine: Line = {
  id: 'ginza',
  name: '東京メトロ銀座線',
  color: '#ff9500',
  stations: [
    { id: 'asakusa-ginza', name: '浅草', lineId: 'ginza', lon: 139.7981, lat: 35.7114 },
    { id: 'tawaramachi', name: '田原町', lineId: 'ginza', lon: 139.7792, lat: 35.7142 },
    { id: 'ueno', name: '上野', lineId: 'ginza', lon: 139.7748, lat: 35.7136 },
  ],
}
